import RELATIONS from "./RELATIONS";

function fetchRelations(query) {
  const lowerCaseQuery = query.toLowerCase();
  return Promise.resolve().then(() => {
    return RELATIONS.filter(
      (item) => item.name.toLowerCase().indexOf(lowerCaseQuery) === 0
    );
  });
}

export default fetchRelations;
