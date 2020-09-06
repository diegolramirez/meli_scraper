"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Model = require("./model");
// const _model = new Model();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const input = JSON.parse(fs.readFileSync("./out.json"));

  const matcher = new Model(input);

  console.log(matcher.items.slice(0, 10));

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
