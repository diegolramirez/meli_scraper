"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Scraper = require("../scraper");

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const scraper = new Scraper("iphone");

  console.log(scraper.query);

  await scraper.scraper();

  console.log(scraper.items.length);

  fs.writeFileSync(`./utils/outScraper.json`, JSON.stringify(scraper.items));
  console.log("guardado en ./utils/outScraper.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
