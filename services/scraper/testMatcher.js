"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Matcher = require("./matcher");

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const inputScraper = JSON.parse(fs.readFileSync("./utils/outScraper.json"));

  const matcher = new Matcher(inputScraper);

  matcher.matcher();

  console.log(matcher.uniqueItems);

  fs.writeFileSync(
    `./utils/outMatcher.json`,
    JSON.stringify(matcher.uniqueItems)
  );
  console.log("guardado en ./outMatcher.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
