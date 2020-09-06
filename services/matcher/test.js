"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Model = require("./model");
// const _model = new Model();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const input = JSON.parse(fs.readFileSync("./out.json"));

  const matcher = new Model(input);

  const res1 = matcher.similarityScore(input[0], input[1]);
  console.log("res1", res1);
  matcher.similarityScore(input[10], input[20]);
  // matcher.similarityScore(
  //   {price: 10, nameMatch: "lala"},
  //   {price: 10, nameMatch: "lala"}
  // );
  // matcher.priceSimilarityScore(60000, 6100);

  // console.log(matcher.items.slice(0, 10));

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
