import { EditorState, Modifier, SelectionState } from "draft-js";

// create entity, replacing all the text contents in the range with the entity text
function createEntity(
  entityText,
  entityType,
  entityTypeString,
  blockKey,
  start,
  end,
  editorState
) {
  let contentState = editorState
    .getCurrentContent()
    .createEntity(entityType, "IMMUTABLE", {
      text: entityText,
    });

  const entityKey = contentState.getLastCreatedEntityKey();
  const rangeToReplace = SelectionState.createEmpty(blockKey)
    .set("anchorOffset", start)
    .set("focusOffset", end);
  const fullEntityText = entityTypeString + entityText;

  contentState = Modifier.replaceText(
    contentState,
    rangeToReplace,
    fullEntityText,
    null,
    entityKey
  );
  let updatedEditorState = EditorState.push(
    editorState,
    contentState,
    "apply-entity"
  );
  updatedEditorState = EditorState.set(updatedEditorState, {
    selection: rangeToReplace
      .set("anchorOffset", start + fullEntityText.length)
      .set("focusOffset", start + fullEntityText.length)
      .set("hasFocus", true),
  });
  return updatedEditorState;
}

export default createEntity;
