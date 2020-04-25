import {
  AUTOCOMPLETE_DOWN,
  AUTOCOMPLETE_SELECTION,
  AUTOCOMPLETE_UP,
  getAutocompleteCommand,
} from "./lib/AUTOCOMPLETE_COMMANDS";
import { Editor, EditorState, getDefaultKeyBinding } from "draft-js";
import React, { useEffect, useRef, useState } from "react";

import EntityList from "./EntityList";
import createEntity from "./lib/createEntity";
import getDraftEntityProps from "./lib/getDraftEntityProps";
import getEntityDecorator from "./lib/getEntityDecorator";
import getSelectionFocusProps from "./lib/getSelectionFocusProps";
import isEqual from "lodash/isEqual";
import styles from "./App.module.scss";
import useAutocompleteBounds from "./hooks/useAutocompleteBounds";
import useAutocompleteResults from "./hooks/useAutocompleteResults";
import useDraftEntity from "./hooks/useDraftEntity";
import useWindowSize from "./hooks/useWindowSize";

const NAVIGATIONAL_KEYS = [
  "Down",
  "ArrowDown",
  "Left",
  "ArrowLeft",
  "Up",
  "ArrowUp",
  "Right",
  "ArrowRight",
];
function App() {
  const [editorState, setEditorState] = useState(
    EditorState.set(EditorState.createEmpty(), {
      decorator: getEntityDecorator(),
    })
  );

  const [selectionIndex, setSelectionIndex] = useState(0);
  const [autocompleteSize, setAutocompleteSize] = useState(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const windowSize = useWindowSize();
  const draftEntity = useDraftEntity(editorState, setEditorState);
  const { results, resultsQuery } = useAutocompleteResults(
    draftEntity,
    editorState
  );
  const autocompleteBounds = useAutocompleteBounds(
    draftEntity,
    windowSize,
    containerRef,
    editorState,
    results,
    autocompleteSize
  );

  const onKeyEvent = (evt) => {
    const keyCommand = draftEntity ? getAutocompleteCommand(evt.key) : null;
    if (keyCommand) {
      return keyCommand;
    }
    if (!draftEntity) {
      const { selection, contentState, contentBlock } = getSelectionFocusProps(
        editorState
      );
      const entityKey = contentBlock.getEntityAt(selection.getFocusOffset());
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        if (entity && !entity.data.isDraft) {
          // if the user wants to backspace, we only allow it if the previous character
          // is not a part of this entity
          if (evt.key === "Backspace") {
            const prevEntityKey = contentBlock.getEntityAt(
              selection.getFocusOffset() - 1
            );
            if (prevEntityKey === entityKey) {
              return "disabled";
            }
          } else if (!NAVIGATIONAL_KEYS.includes(evt.key)) {
            return "disabled";
          }
        }
      }
    }
    return getDefaultKeyBinding(evt);
  };

  const onAutocompleteSelect = (entityText) => {
    const { entityKey: draftEntityKey, blockKey } = draftEntity;
    const { entityType, start, end, entityTypeString } = getDraftEntityProps(
      draftEntityKey,
      blockKey,
      editorState
    );
    const updatedEditorState = createEntity(
      entityText,
      entityType,
      entityTypeString,
      blockKey,
      start,
      end,
      editorState
    );

    setEditorState(updatedEditorState);
    setSelectionIndex(0);
  };

  const onKeyCommand = (command) => {
    if (command === AUTOCOMPLETE_DOWN) {
      const nextSelectionIndex = selectionIndex + 1;
      if (nextSelectionIndex < results.length) {
        setSelectionIndex(nextSelectionIndex);
      }
      return "handled";
    }
    if (command === AUTOCOMPLETE_UP) {
      const nextSelectionIndex = selectionIndex - 1;
      if (nextSelectionIndex >= 0) {
        setSelectionIndex(nextSelectionIndex);
      }
      return "handled";
    }
    if (command === AUTOCOMPLETE_SELECTION) {
      if (results[selectionIndex]) {
        onAutocompleteSelect(results[selectionIndex].name);
      }
      return "handled";
    }
    return "not-handled";
  };

  const updateSelection = (selectionIndex) => {
    onAutocompleteSelect(results[selectionIndex].name);
    Promise.resolve().then(() => {
      editorRef.current.focus();
    });
  };

  useEffect(() => {
    if (!draftEntity || !resultsQuery) {
      setAutocompleteSize(null);
    } else if (containerRef && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const size = { width, height };
      if (autocompleteSize && isEqual(autocompleteSize, size)) {
        return;
      }
      setAutocompleteSize({ width, height });
    }
  }, [setAutocompleteSize, draftEntity, resultsQuery, autocompleteSize]);

  return (
    <div className={styles.editorContainer} ref={containerRef}>
      <div className={styles.editorLiner}>
        <div
          className={styles.editor}
          onClick={() => editorRef.current.focus()}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={editorRef}
            handleKeyCommand={onKeyCommand}
            keyBindingFn={onKeyEvent}
          />
        </div>
        {draftEntity && resultsQuery ? (
          <EntityList
            bounds={autocompleteBounds}
            entityType={draftEntity.entityType}
            results={results}
            matchString={resultsQuery}
            selectionIndex={selectionIndex}
            updateSelectionIndex={setSelectionIndex}
            updateSelection={updateSelection}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
