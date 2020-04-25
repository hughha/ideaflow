// find the text range for the given entity
function findEntityRange(contentBlock, entityKey) {
  let range = { start: null, end: null };
  contentBlock.findEntityRanges(
    (meta) => meta.entity === entityKey,
    (start, end) => {
      range = { start, end };
    }
  );
  return range;
}

export default findEntityRange;
