/* eslint-disable */
require("dotenv").config();
const fs = require("fs");
const beautify = require("json-beautify");
const issueEntries = require("./lib/exportSearchResults.js");

async function getSearchResults() {
  const issues = [];
  let data = null;

  // Search for a last_run.txt file
  // This is so we can update the results after a period of time instead of running the entire query over again
  if (fs.existsSync("last_run.txt")) {
    data = fs.readFileSync("last_run.txt", "UTF-8");
  }

  // Specify the criteria to search on
  // For Search Syntax, see: https://docs.github.com/en/github/searching-for-information-on-github/understanding-the-search-syntax
  const searchCriteria = "PUT CRITERIA HERE";

  const results = await issueEntries(searchCriteria, data);

  results.issueEntries.forEach(result => {
    issues.push(result);
  });

  var json = beautify(issues, null, 2, null);

  fs.writeFile(`search-results.json`, json, function(err) {
    if (err) throw err;
    console.log("file saved!");
  });

  var lastRun = results.currentPageCursor;
  fs.writeFile(`last_run.txt`, lastRun, function(err) {
    if (err) throw err;
    console.log("file saved!");
  });
}

getSearchResults();
