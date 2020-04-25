import HASHTAGS from "./HASHTAGS";

function fetchHashtags(query) {
  const lowerCaseQuery = query.toLowerCase();
  return Promise.resolve().then(() => {
    return HASHTAGS.filter(
      (item) => item.name.toLowerCase().indexOf(lowerCaseQuery) === 0
    );
  });
}

export default fetchHashtags;
