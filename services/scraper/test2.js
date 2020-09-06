"use strict";

const Model = require("./model");
const fs = require("fs");
const _model = new Model();
const moment = require("moment-timezone");

(async () => {
  console.log("start:", moment().format("YYYY-MM-DD hh:mm:ss"));

  const res = _model.inputItemFormatter();

  console.log(res);

  console.log("end:", moment().format("YYYY-MM-DD hh:mm:ss"));
})();
