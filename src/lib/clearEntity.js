import { EditorState, Modifier } from "draft-js";

import findEntityRange from "./findEntityRange";

function clearEntity(entityKey, blockKey, editorState) {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(blockKey);
  const { start, end } = findEntityRange(contentBlock, entityKey);
  const selection = editorState.getSelection();
  const entitySelection = selection
    .set("anchorOffset", start)
    .set("focusOffset", end);

  const updatedContentState = Modifier.applyEntity(
    editorState.getCurrentContent(),
    entitySelection,
    null
  );
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    "apply-entity"
  );

  return EditorState.set(updatedEditorState, { selection });
}

export default clearEntity;
