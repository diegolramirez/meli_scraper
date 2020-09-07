"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Scraper = require("./scraper");
// const _scraper = new Scraper();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const scraper = new Scraper("iphone");
  console.log(scraper.query);

  await scraper.scraperSearch();
  console.log(scraper.items.length);
  // console.log(scraper.items.slice(0, 5));

  fs.writeFileSync(`./outScraper.json`, JSON.stringify(scraper.items));
  console.log("guardado en ./outScraper.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
