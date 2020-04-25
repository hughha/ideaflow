// convenience function for getting all properties around the cursor
function getSelectionFocusProps(editorState) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockKey = selection.getFocusKey();
  const contentBlock = contentState.getBlockForKey(blockKey);
  return {
    selection,
    contentState,
    blockKey,
    contentBlock,
  };
}

export default getSelectionFocusProps;
