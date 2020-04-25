import { ENTITY_TYPE_HASHTAG, ENTITY_TYPE_PERSON } from "../lib/ENTITY_TYPES";
import { useEffect, useState } from "react";

import fetchHashtags from "../api/fetchHashTags";
import fetchPeople from "../api/fetchPeople";
import fetchRelations from "../api/fetchRelations";
import getDraftEntityProps from "../lib/getDraftEntityProps";

// hook for updating autocomplete results
function useAutocompleteResults(draftEntity, editorState) {
  const [results, setResults] = useState([]);
  const [resultsQuery, setResultsQuery] = useState();
  const [resultsQueryType, setResultsQueryType] = useState();

  useEffect(() => {
    if (!draftEntity) {
      return;
    }
    const draftEntityProps = getDraftEntityProps(
      draftEntity.entityKey,
      draftEntity.blockKey,
      editorState
    );
    const query = draftEntityProps.matchString;
    const queryType = draftEntityProps.entityType;
    if (resultsQuery !== query || resultsQueryType !== queryType) {
      if (query) {
        const fetchResults =
          queryType === ENTITY_TYPE_PERSON
            ? fetchPeople
            : queryType === ENTITY_TYPE_HASHTAG
            ? fetchHashtags
            : fetchRelations;
        fetchResults(query).then((queryResults) => {
          setResults(queryResults);
          setResultsQuery(query);
          setResultsQueryType(queryType);
        });
      } else {
        setResults([]);
        setResultsQuery(query);
        setResultsQueryType(queryType);
      }
    }
  }, [draftEntity, editorState, resultsQuery, resultsQueryType]);
  return { results, resultsQuery };
}

export default useAutocompleteResults;
