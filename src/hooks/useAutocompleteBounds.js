import { useEffect, useState } from "react";

import entityListStyle from "../EntityList.module.scss";
import isEqual from "lodash/isEqual";

// used to adjust the coordinates of the autocomplete
// when it will be cut off by the right side of the window
function getLeft(box, containerBox, listBox, windowSize) {
  const normalLeft = box.left - containerBox.left;
  if (!listBox) {
    return normalLeft;
  }
  const right = box.left + listBox.width;
  if (right <= windowSize.width) {
    return normalLeft;
  }
  return windowSize.width - listBox.width - containerBox.left;
}

// used to adjust the coordinates of the autocomplete
// when it will be cut off by the bottom of the window
function getTop(box, containerBox, listBox, windowSize) {
  const nomalTop = box.bottom - containerBox.top;
  if (!listBox) {
    return nomalTop;
  }
  const bottom = box.bottom + listBox.height;
  if (bottom <= windowSize.height) {
    return nomalTop;
  }
  return box.top - listBox.height - containerBox.top;
}

// hook for handling updating the bounds of the autocomplete box
// positioning it below the draft entity being typed
function useAutocompleteBounds(
  draftEntity,
  windowSize,
  containerRef,
  editorState,
  results,
  autocompleteSize
) {
  const [autocompleteBounds, setAutocompleteBounds] = useState();

  useEffect(() => {
    if (!draftEntity) {
      if (autocompleteBounds) {
        setAutocompleteBounds(null);
      }
      return;
    }
    const entityElement = containerRef.current.querySelector(
      `[data-entity-key="${draftEntity.entityKey}"]`
    );
    if (!entityElement) {
      if (autocompleteBounds) {
        setAutocompleteBounds(null);
      }
      return;
    }

    const box = entityElement.getBoundingClientRect();

    const containerBox = containerRef.current.getBoundingClientRect();
    const listElement = containerRef.current.querySelector(
      `.${entityListStyle.entityList}`
    );

    const listBox = listElement ? listElement.getBoundingClientRect() : null;

    const bounds = {
      top: getTop(box, containerBox, listBox, windowSize),
      left: getLeft(box, containerBox, listBox, windowSize),
      maxHeight: Math.max(40, windowSize.height - box.bottom - 20),
    };

    if (!autocompleteBounds || !isEqual(autocompleteBounds, bounds)) {
      setAutocompleteBounds(bounds);
    }
  }, [
    draftEntity,
    containerRef,
    windowSize,
    autocompleteBounds,
    editorState,
    results,
    // needsAdjustment,
    autocompleteSize,
    // runAdjustment,
  ]);
  return autocompleteBounds;
}

export default useAutocompleteBounds;
