// report.js
const c = require("./sfmovie.js");

// Start reading data

const csvParse = require("csv-parse");
const parse = csvParse.parse;
const filePath = process.argv[2];

const fs = require("fs");

let svgContents = "";
const createReport = (err, data) => {
  // TODO: add your code for report here
  const lonFunFacts = c.longestFunFact(data);
  console.log(
    `* The movie ${lonFunFacts["title"]} Smile has the longest fun facts, it was filmed in ${lonFunFacts["Release Year"]}`
  );

  console.log(`* The movies filmed in 2021 are ${c.getMovies2021(data)}.`);

  console.log(
    `Three of production Companies are: ${c.getProductionCompany(data)}`
  );

  const result = c.mostPopularActors;

  svgContents = `<svg xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="25" width="25" height="${result[0].occurrences}" fill="blue">
</rect>
<text x="250" y="45" fill="black" font-size="15"> ${result[0].name}
</text>
<rect x="0" y="55" width="25" height="${result[1].occurrences}" fill="yellow">
</rect>  
<text x="250" y="75" fill="black" font-size="15"> ${result[1].name}
</text>
<rect x="0" y="85" width="25" height="${result[2].occurrences}" fill="black">
</rect>
<text x="250" y="105" fill="black" font-size="15"> ${result[1].name}
</text>
</svg>`;
};

// create a function that both reads and parses data
const createReader = (parserFunc) => {
  return (fileName, cb) => {
    // TODO: check error object
    // cb should take err and parsedData as arguments
    console.log(fileName + "");
    parse(
      fileName,
      {
        comment: "#",
      },
      function (err, records) {
        console.log(err, records);
      }
    );
    fs.readFile(fileName, (err, data) => parserFunc(data, cb));
  };
};

const csvReader = createReader(parse);

// use new reader / parser and pass in report creating function as callback
csvReader(filePath, createReport);

fs.writeFile("chart.svg", svgContents, function (error) {
  if (error) {
    return console.log("Error has occurred!");
  }
});
