import {
  ENTITY_TYPE_HASHTAG,
  ENTITY_TYPE_PERSON,
  ENTITY_TYPE_RELATION,
} from "./lib/ENTITY_TYPES";

import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import styles from "./Entity.module.scss";

// render an entity into the editor
function Entity(props) {
  const { contentState, entityKey, children } = props;

  const entity = contentState.getEntity(entityKey) || {};
  return (
    <span
      data-entity-key={entityKey}
      className={classnames(
        styles.entity,
        entity.data && entity.data.isDraft && styles.draft,
        entity.type === ENTITY_TYPE_PERSON && styles.person,
        entity.type === ENTITY_TYPE_HASHTAG && styles.hashtag,
        entity.type === ENTITY_TYPE_RELATION && styles.relation
      )}
    >
      {children}
    </span>
  );
}

Entity.propTypes = {
  contentState: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.node,
};
export default Entity;
