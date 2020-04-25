import findEntityRange from "./findEntityRange";
import { getEntityTypeString } from "./ENTITY_TYPES";

// get full properties for a draft entity
function getDraftEntityProps(entityKey, blockKey, editorState) {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(blockKey);
  const entity = contentState.getEntity(entityKey);
  const range = findEntityRange(contentBlock, entityKey);
  const entityString = contentBlock.text.substring(range.start, range.end);
  const entityType = entity.type;
  const entityTypeString = getEntityTypeString(entityType);
  const matchString = entityString.substring(entityTypeString.length);

  return {
    ...range,
    matchString,
    entityType,
    entityString,
    entityTypeString,
  };
}

export default getDraftEntityProps;
