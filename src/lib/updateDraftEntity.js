import { EditorState, Modifier } from "draft-js";

import findEntityRange from "./findEntityRange";
import getSelectionFocusProps from "./getSelectionFocusProps";

// update the draft entity, normally for a user typing into it
function updateDraftEntity(draftEntity, editorState) {
  const { entityKey } = draftEntity;

  const { selection, contentState, contentBlock } = getSelectionFocusProps(
    editorState
  );

  const cursor = selection.getFocusOffset();
  const { start, end } = findEntityRange(contentBlock, entityKey);

  // if cursor is > anchor end, then use cursor to extend entity, otherwise don't make changes
  if (cursor > end) {
    const entitySelection = selection
      .set("anchorOffset", start)
      .set("focusOffset", cursor);
    const updatedContentState = Modifier.applyEntity(
      contentState,
      entitySelection,
      entityKey
    );

    const updatedEditorState = EditorState.push(
      editorState,
      updatedContentState,
      "apply-entity"
    );

    return EditorState.set(updatedEditorState, { selection });
  }
  return editorState;
}

export default updateDraftEntity;
