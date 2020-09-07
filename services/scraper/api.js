"use strict";

const status = require("http-status");
const Model = require("./model");

module.exports = async function(app, prefix) {
  const model = new Model();

  app.get(prefix + "/options", (req, res) => {
    try {
      const text = model.helloWorld();
      console.log(text);
      res.status(status.OK).json(text);
    } catch (err) {
      console.log(err);
    }
    return res;
  });

  app.put(prefix + "/options", (req, res) => {
    try {
      const text = model.helloWorld();
      console.log(text);
      res.status(status.OK).json(text);
    } catch (err) {
      console.log(err);
    }
    return res;
  });

  app.put(prefix + "/default", (req, res) => {
    try {
      const text = model.helloWorld();
      console.log(text);
      res.status(status.OK).json(text);
    } catch (err) {
      console.log(err);
    }
    return res;
  });

  app.post(prefix + "/query", (req, res) => {
    try {
      const text = model.helloWorld();
      console.log(text);
      res.status(status.OK).json(text);
    } catch (err) {
      console.log(err);
    }
    return res;
  });
};
