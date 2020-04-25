import PEOPLE from "./PEOPLE";

function fetchPeople(query) {
  const lowerCaseQuery = query.toLowerCase();
  return Promise.resolve().then(() => {
    return PEOPLE.filter(
      (item) => item.name.toLowerCase().indexOf(lowerCaseQuery) === 0
    );
  });
}

export default fetchPeople;
