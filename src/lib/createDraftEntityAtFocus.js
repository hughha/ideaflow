import { ENTITY_TYPE_RELATION_STRING, getEntityType } from "./ENTITY_TYPES";
import { EditorState, Modifier } from "draft-js";

import getSelectionFocusProps from "./getSelectionFocusProps";

const getEntityTypeStringAtFocus = (selection, contentBlock) => {
  const focusOffset = selection.getFocusOffset();
  const charAtFocus = contentBlock.text.substr(focusOffset - 1, 1);
  if (charAtFocus === ENTITY_TYPE_RELATION_STRING[1]) {
    return ENTITY_TYPE_RELATION_STRING;
  }
  return charAtFocus;
};

// create a new draft entity at the focus
function createDraftEntityAtFocus(editorState) {
  const {
    selection,
    contentState,
    blockKey,
    contentBlock,
  } = getSelectionFocusProps(editorState);

  const entityEnd = selection.getAnchorOffset();
  const entityTypeString = getEntityTypeStringAtFocus(selection, contentBlock);
  const entityStart = selection.getAnchorOffset() - entityTypeString.length;
  const entityType = getEntityType(entityTypeString);
  let updatedContentState = contentState.createEntity(entityType, "MUTABLE", {
    isDraft: true,
  });
  const entityKey = updatedContentState.getLastCreatedEntityKey();
  const entitySelection = selection
    .set("anchorOffset", entityStart)
    .set("focusOffset", entityEnd);
  updatedContentState = Modifier.applyEntity(
    updatedContentState,
    entitySelection,
    entityKey
  );

  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    "apply-entity"
  );
  return {
    editorState: EditorState.set(updatedEditorState, { selection }),
    draftEntity: {
      entityKey,
      entityType,
      blockKey,
    },
  };
}

export default createDraftEntityAtFocus;
