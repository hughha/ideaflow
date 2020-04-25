import invert from "lodash/invert";

export const ENTITY_TYPE_PERSON = "PERSON";
export const ENTITY_TYPE_HASHTAG = "HASHTAG";
export const ENTITY_TYPE_RELATION = "RELATION";

export const ENTITY_TYPE_PERSON_STRING = "@";
export const ENTITY_TYPE_HASHTAG_STRING = "#";
export const ENTITY_TYPE_RELATION_STRING = "<>";

export const ENTITY_TYPE_STRING_MAP = {
  [ENTITY_TYPE_PERSON]: ENTITY_TYPE_PERSON_STRING,
  [ENTITY_TYPE_HASHTAG]: ENTITY_TYPE_HASHTAG_STRING,
  [ENTITY_TYPE_RELATION]: ENTITY_TYPE_RELATION_STRING,
};

export const ENTITY_TYPES_LIST = [...Object.keys(ENTITY_TYPE_STRING_MAP)];
export const ENTITY_TYPE_MAP = invert(ENTITY_TYPE_STRING_MAP);

export function getEntityTypeString(entityType) {
  return ENTITY_TYPE_STRING_MAP[entityType];
}

export function getEntityType(entityTypeString) {
  return ENTITY_TYPE_MAP[entityTypeString];
}
