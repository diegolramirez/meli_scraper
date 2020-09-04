"use strict";

const Model = require("./model");
const fs = require("fs");
const _model = new Model();

(async () => {
  let res = await _model.scraperBuscador("xiaomi");
  console.log("total capturados:", res.length);

  res = res.map(async item => {
    item.vendor = (await _model.scraperItem(item.itemurl)).vendor;
    return item;
  });

  fs.writeFileSync("./out.json", JSON.stringify(res));
  console.log("guardado en ./out.json");
})();
