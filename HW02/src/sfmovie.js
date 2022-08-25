// sfmovie.js
//node src/report.js ./data/Film_Locations_in_San_Francisco.csv

function longestFunFact(data) {
  let longLen = 0;
  let finalIndex = 0;
  data.map(function findIndex(element, index) {
    if (element["Fun Facts"] > longLen) {
      longLen = element["Fun Facts"].length;
      finalIndex = index;
    }
  });
  return data[finalIndex];
}

function getMovies2021(data) {
  const result = [];
  data.map((element) =>
    result.includes(element["Title"]) === false &&
    element["Release Year"] === 2021
      ? result.push(element)
      : ""
  );
  return result;
}
function getProductionCompany(data) {
  const result = [];
  data.map((element) =>
    result.includes(element["Distributor"]) === false
      ? result.push(element)
      : ""
  );
  return result;
}

//??
function mostPopularActors(data) {
  const result = [];
  data.map(function iterActors(element) {
    const actor1 = element["Actor 1"];
    if (result.filter((e) => e.name === actor1)) {
      const index = result.indexOf(actor1);
      result[index].occurrences++;
    } else {
      result.push({ name: `${actor1}`, occurrences: 1 });
    }

    const actor2 = element["Actor 2"];
    if (result.filter((e) => e.name === actor2)) {
      const index = result.indexOf(actor2);
      result[index].occurrences++;
    } else {
      result.push({ name: `${actor2}`, occurrences: 1 });
    }
    const actor3 = element["Actor 3"];
    if (result.filter((e) => e.name === actor3)) {
      const index = result.indexOf(actor3);
      result[index].occurrences++;
    } else {
      result.push({ name: `${actor3}`, occurrences: 1 });
    }
  });

  result.sort(function (a, b) {
    return a.occurrences - b.occurrences;
  });
  result.slice(0, 2);
  return result;
}

module.exports = {
  longestFunFact: longestFunFact,
  getMovies2021: getMovies2021,
  getProductionCompany: getProductionCompany,
  mostPopularActors: mostPopularActors,
};
