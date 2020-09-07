"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Model = require("./model");
// const _model = new Model();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const inputScraper = JSON.parse(fs.readFileSync("./outScraper.json"));
  const inputMatcher = JSON.parse(fs.readFileSync("./outMatcher.json"));

  const matcher = new Model(inputScraper);
  // matcher.uniqueItems = inputMatcher;

  // matcher.uniqueItemsFormatter();

  // console.log(matcher.uniqueItems);
  //
  // const res1 = matcher.similarityScore(input[0], input[1]);
  // console.log("res1", res1);
  // matcher.similarityScore(input[10], input[20]);
  // matcher.similarityScore(
  //   {price: 10, nameMatch: "lala"},
  //   {price: 10, nameMatch: "lala"}
  // );
  // matcher.priceSimilarityScore(60000, 6100);

  // console.log(matcher.items.slice(0, 10));

  // const filtered = matcher.priceFilter(10000);
  // console.log("filtered", filtered);
  // console.log("items", matcher.items[8]);

  matcher.matcher();

  console.log(matcher.uniqueItems);

  fs.writeFileSync(`./outMatcher.json`, JSON.stringify(matcher.uniqueItems));
  console.log("guardado en ./outMatcher.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
