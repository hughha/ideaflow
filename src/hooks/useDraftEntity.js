import {
  ENTITY_TYPE_HASHTAG,
  ENTITY_TYPE_HASHTAG_STRING,
  ENTITY_TYPE_PERSON_STRING,
  ENTITY_TYPE_RELATION_STRING,
} from "../lib/ENTITY_TYPES";
import { useEffect, useState } from "react";

import clearEntity from "../lib/clearEntity";
import createDraftEntityAtFocus from "../lib/createDraftEntityAtFocus";
import createHashtag from "../lib/createHashtag";
import getDraftEntityProps from "../lib/getDraftEntityProps";
import getSelectionFocusProps from "../lib/getSelectionFocusProps";
import updateDraftEntity from "../lib/updateDraftEntity";

// in the case that the user backspaces out of the draft entity, this clears it
function clearDraftEntityIfDeleted(
  editorState,
  draftEntity,
  setDraftEntity,
  setEditorState
) {
  if (draftEntity) {
    const { start, entityString, entityTypeString } = getDraftEntityProps(
      draftEntity.entityKey,
      draftEntity.blockKey,
      editorState
    );

    // if entity is not found at all, just clear it
    if (start === null) {
      setDraftEntity(null);
    }
    // entity must contain the entity characters
    // if the user deletes these characters
    // we interpret that to mean they don't want the
    // text to be treated as an entity
    else if (entityString.indexOf(entityTypeString) !== 0) {
      // clear out draft entity
      setEditorState(
        clearEntity(draftEntity.entityKey, draftEntity.blockKey, editorState)
      );
    }
  }
}

// return a draft entity at the cursor, if there is one
function getDraftEntityAtFocus(contentState, contentBlock, selection) {
  const entityKey = contentBlock.getEntityAt(selection.getFocusOffset() - 1);
  if (!entityKey) {
    return null;
  }
  const draftEntity = contentState.getEntity(entityKey);
  // entity must be a draft entity
  if (!draftEntity || !draftEntity.data.isDraft) {
    return null;
  }

  return { entityKey, draftEntity };
}

// if the user is typing to start a new draft entity
function isStartingDraftEntity(typedCharacter, previousCharacter) {
  return (
    typedCharacter === ENTITY_TYPE_PERSON_STRING ||
    typedCharacter === ENTITY_TYPE_HASHTAG_STRING ||
    (typedCharacter === ENTITY_TYPE_RELATION_STRING[1] &&
      previousCharacter === ENTITY_TYPE_RELATION_STRING[0])
  );
}

// if the user is tying to create a new hashtag
function isCreatingHashtag(typedCharacter, entityType) {
  return typedCharacter === " " && entityType === ENTITY_TYPE_HASHTAG;
}

// hook to create, update, clear draft entity
function useDraftEntity(editorState, setEditorState) {
  const [draftEntity, setDraftEntity] = useState();
  useEffect(() => {
    clearDraftEntityIfDeleted(
      editorState,
      draftEntity,
      setDraftEntity,
      setEditorState
    );

    const {
      selection,
      contentState,
      blockKey,
      contentBlock,
    } = getSelectionFocusProps(editorState);

    if (!selection.isCollapsed()) {
      setDraftEntity(null);
      return;
    }
    // if typing a character, modify the current draft entity or create a new one
    if (editorState.getLastChangeType() === "insert-characters") {
      const typedCharacter = contentBlock
        .getText()
        .charAt(selection.getFocusOffset() - 1);
      const previousCharacter = contentBlock.text.charAt(
        selection.getFocusOffset() - 2
      );
      if (draftEntity) {
        if (isCreatingHashtag(typedCharacter, draftEntity.entityType)) {
          // create a hashtag entity
          setEditorState(createHashtag(draftEntity, editorState));
          setDraftEntity(null);
        } else {
          // modify the draft entity
          setEditorState(updateDraftEntity(draftEntity, editorState));
        }
      } else if (isStartingDraftEntity(typedCharacter, previousCharacter)) {
        // create draft entity
        const {
          draftEntity: updatedDraftEntity,
          editorState: updatedEditorState,
        } = createDraftEntityAtFocus(editorState);
        setEditorState(updatedEditorState);
        setDraftEntity(updatedDraftEntity);
      }
    } else {
      // if not typing a character, find a draft entity at the cursor and apply it
      const {
        entityKey: draftEntityAtFocusKey,
        draftEntity: draftEntityAtFocus,
      } = getDraftEntityAtFocus(contentState, contentBlock, selection) || {};

      if (draftEntityAtFocus) {
        // apply draft entity
        if (!draftEntity || draftEntity.entityKey !== draftEntityAtFocusKey) {
          setDraftEntity({
            entityKey: draftEntityAtFocusKey,
            entityType: draftEntityAtFocus.type,
            blockKey,
          });
        }
      } else if (draftEntity) {
        // clear draft entity
        setDraftEntity(null);
      }
    }
  }, [draftEntity, editorState, setEditorState]);
  return draftEntity;
}

export default useDraftEntity;
