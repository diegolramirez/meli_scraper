"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Model = require("./model");
const _model = new Model();

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const res = await _model.newQueryResult("arena gato");

  console.log(res);

  fs.writeFileSync(`./utils/outModel.json`, JSON.stringify(res));
  console.log("guardado en ./utils/outModel.json");

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
