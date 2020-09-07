"use strict";

const status = require("http-status");
const Model = require("./model");

module.exports = async function(app, prefix) {
  const model = new Model();

  app.get(prefix + "/options", (req, res) => {
    console.log("GET /options");
    try {
      const options = model.getOptions();
      res.status(status.OK).json(options);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.put(prefix + "/default", (req, res) => {
    console.log("PUT /default");
    try {
      model.defaultOptions();
      res.status(status.OK).json("Default options restored");
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.put(prefix + "/options", (req, res) => {
    console.log("PUT /options - body:", req.body);
    try {
      model.updateOptions(req.body);
      res.status(status.OK).json("Options updated");
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.post(prefix + "/query", async (req, res) => {
    console.log("POST /query - body:", req.body);
    try {
      const clusters = await model.newQueryResult(req.body.query);
      res.status(status.OK).json(clusters);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.get(prefix + "/query", async (req, res) => {
    console.log("GET /query");
    try {
      const clusters = await model.getQueryResult();
      res.status(status.OK).json(clusters);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });
};
