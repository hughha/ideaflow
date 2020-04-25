import { EditorState, Modifier } from "draft-js";

import { ENTITY_TYPE_HASHTAG } from "./ENTITY_TYPES";
import createEntity from "./createEntity";
import getDraftEntityProps from "./getDraftEntityProps";

// create a hashtag entity from the draftEntity
function createHashtag(draftEntity, editorState) {
  const { entityKey: draftEntityKey, blockKey } = draftEntity;
  const { entityTypeString, start, end, entityString } = getDraftEntityProps(
    draftEntityKey,
    blockKey,
    editorState
  );

  const selection = editorState.getSelection();
  let contentState = editorState.getCurrentContent();
  const hashtagString = entityString
    .split(" ")[0]
    .substring(entityTypeString.length);

  // clear out draft entity
  const entitySelection = selection
    .set("anchorOffset", start)
    .set("focusOffset", end);
  contentState = Modifier.applyEntity(contentState, entitySelection, null);
  let updatedEditorState = EditorState.push(
    editorState,
    contentState,
    "apply-entity"
  );

  // if hashtag is not empty, create a new hashtag entity
  if (hashtagString) {
    updatedEditorState = createEntity(
      hashtagString,
      ENTITY_TYPE_HASHTAG,
      entityTypeString,
      blockKey,
      start,
      start + hashtagString.length + entityTypeString.length,
      updatedEditorState
    );
  }
  updatedEditorState = EditorState.set(updatedEditorState, {
    selection: selection,
  });
  return updatedEditorState;
}

export default createHashtag;
