"use strict";

const Model = require("./model");
const fs = require("fs");
// const _model = new Model();

(async () => {
  // process.setMaxListeners(0);

  const scraper = new Model("arena para gatos gaticos");
  console.log(scraper.query);

  await scraper.scraperSearch();
  console.log(scraper.items.length);
  console.log(scraper.items.slice(0, 5));
  // console.log("total capturados:", res.length);
  //
  // const step = 10;
  // let res2 = [];
  // for (let i = 0; i < res.length; i += step) {
  //   console.log("voy por", i);
  //   res2 = res2.concat(
  //     await Promise.all(
  //       res.slice(i, i + step).map(async item => {
  //         item.vendor = (await _model.scraperItem(item.itemurl)).vendor;
  //         return item;
  //       })
  //     )
  //   );
  // }
  //
  // fs.writeFileSync(`./out.json`, JSON.stringify(res2));
  // console.log("guardado en ./out.json");
})();
