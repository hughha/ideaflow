import {
  ENTITY_TYPES_LIST,
  ENTITY_TYPE_HASHTAG,
  ENTITY_TYPE_PERSON,
  ENTITY_TYPE_RELATION,
} from "./lib/ENTITY_TYPES";
import React, { useEffect, useRef } from "react";

import EntityImage from "./EntityImage";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./EntityList.module.scss";

function getScrollIntoViewOffset(elem, container) {
  const elemBox = elem.getBoundingClientRect();
  const containerBox = container.getBoundingClientRect();
  if (elemBox.top < containerBox.top) {
    return elemBox.top - containerBox.top;
  } else if (elemBox.bottom > containerBox.bottom) {
    return elemBox.bottom - containerBox.bottom;
  }
  return 0;
}

// render an entity autocomplete list
const EntityList = React.forwardRef((props, forwardedRef) => {
  const {
    results,
    selectionIndex,
    entityType,
    updateSelection,
    bounds,
    matchString,
    updateSelectionIndex,
  } = props;

  const { maxHeight, top, left } = bounds || {};
  const listRef = useRef(null); // NOTE: no easy way to use forwarded ref

  useEffect(() => {
    // scroll selected index into view
    if (listRef && listRef.current) {
      const container = listRef.current.parentNode;
      const selectedElement = container.querySelector(`.${styles.selected}`);
      if (selectedElement) {
        const y = getScrollIntoViewOffset(selectedElement, container);
        container.scrollTop += y;
      }
    }
  });

  return (
    <div
      className={classnames(
        styles.entityList,
        entityType === ENTITY_TYPE_PERSON && styles.person,
        entityType === ENTITY_TYPE_HASHTAG && styles.hashtag,
        entityType === ENTITY_TYPE_RELATION && styles.relation
      )}
      style={bounds ? { maxHeight, top, left, display: "block" } : {}}
      ref={forwardedRef}
    >
      <ul ref={listRef}>
        {!results.length && (
          <li className={styles.noResults}>
            No matches for <em>{matchString}</em>
          </li>
        )}
        {Boolean(results.length) &&
          results.map((item, index) => (
            <li
              key={item.id}
              className={classnames(
                index === selectionIndex && styles.selected
              )}
              onClick={(evt) => {
                updateSelection(index);
                evt.stopPropagation();
              }}
              onMouseOver={() => {
                updateSelectionIndex(index);
              }}
            >
              {entityType === ENTITY_TYPE_PERSON && (
                <EntityImage entity={item} />
              )}
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
});

EntityList.propTypes = {
  results: PropTypes.array.isRequired,
  selectionIndex: PropTypes.number.isRequired,
  entityType: PropTypes.oneOf(ENTITY_TYPES_LIST).isRequired,
  updateSelection: PropTypes.func.isRequired,
  bounds: PropTypes.object,
  matchString: PropTypes.string.isRequired,
  updateSelectionIndex: PropTypes.func.isRequired,
};
export default EntityList;
