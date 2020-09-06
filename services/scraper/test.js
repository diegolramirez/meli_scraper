"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Model = require("./model");
// const _model = new Model();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const scraper = new Model("arena para gatos gaticos");
  console.log(scraper.query);

  await scraper.scraperSearch();
  console.log(scraper.items.length);
  // console.log(scraper.items.slice(0, 5));

  fs.writeFileSync(`./out2.json`, JSON.stringify(scraper.items));
  console.log("guardado en ./out2.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
