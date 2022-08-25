// hoffy.js
//Unit test: npx mocha tests/hoffy-test.js

const fs = require("fs");

// takes any number of string arguments as parameter
// and returns array of parameters with even index
function getEvenParam(...args) {
  return args.filter((element, index) => index % 2 === 0);
}

// takes function as parameter
// and call parameter function unless the parameter is not null or undefined
function maybe(fn) {
  return function newFun(...args) {
    if (args.includes(undefined) || args.includes(null)) {
      return undefined;
    } else {
      return fn(...args);
    }
  };
}

// takes function as parameter
// and return array whose elements satisfy fn's conditoin (fn(element) === true)
function filterWith(fn) {
  return (array) => array.filter(fn);
}

// takes function, repeated number, and an argument as a parameters
// and execute funciton that takes "arg" n times
function repeatCall(fn, n, arg) {
  if (n === 0) {
    return;
  }
  fn(arg);
  repeatCall(fn, n - 1, arg);
}

// takes two functions as parameter
// and returns selected function itself that generates larger output
// each fn, gn: takes one parameter and returns an integer
function largerFn(fn, gn) {
  return (fnParam, gnParam) => (fn(fnParam) >= gn(gnParam) ? fn : gn);
}

// takes function to decorate (to be executed) and number that limits function's execution
// and returns (before function is called n times): parameter function's output with args
//             (after function is called n times): undefined
function limitCallsDecorator(fn, n) {
  let count = 0;
  return function limitCalls(args) {
    if (count < n) {
      count++;
      return fn(args);
    } else {
      return undefined;
    }
  };
}

// takes files, functions for successful execution and failable execution
// and execute errorFn when the function fails to read data from file
// and successFn when function succeed to read data from file
function myReadFile(fileName, successFn, errorFn) {
  fs.readFile(fileName, "utf-8", (err, data) =>
    err ? errorFn(err) : successFn(data)
  );
}

function rowsToObjects(data) {
  const headers = data["headers"];
  const rows = data["rows"];

  const result = rows.map(function (row) {
    return row.reduce(function (result, field, index) {
      result[headers[index]] = field;
      return result;
    }, {});
  });

  return result;
}

module.exports = {
  getEvenParam: getEvenParam,
  maybe: maybe,
  filterWith: filterWith,
  repeatCall: repeatCall,
  largerFn: largerFn,
  limitCallsDecorator: limitCallsDecorator,
  myReadFile: myReadFile,
  rowsToObjects: rowsToObjects,
};
