"use strict";

const status = require("http-status");
const Model = require("./model");
const {check, oneOf, validationResult} = require("express-validator");
const countries = [
  "ar",
  "bo",
  "br",
  "cl",
  "co",
  "cr",
  "do",
  "ec",
  "gt",
  "hn",
  "mx",
  "ni",
  "pa",
  "py",
  "pe",
  "sv",
  "uy",
  "ve"
];

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

  app.put(
    prefix + "/options",
    [
      oneOf(
        [
          check("priceRange").exists(),
          check("nameWeight").exists(),
          check("priceWeight").exists(),
          check("minSimilarityScore").exists(),
          check("similarityThreshold").exists(),
          check("pages").exists(),
          check("country").exists()
        ],
        "At least one updatable parameter must be submited"
      ),
      check(
        "priceRange",
        "Price range must be a float with a value of at least 1"
      ).isFloat({min: 1}),
      check(
        "nameWeight",
        "Name weight must be an integer with a value of at least 1"
      ).isInt({min: 1}),
      check(
        "priceWeight",
        "Price weight must be an integer with a value of at least 1"
      ).isInt({min: 1}),
      check(
        "minSimilarityScore",
        "Min similarity score must be a float with a value between 0 and 1"
      ).isFloat({min: 0, max: 1}),
      check(
        "similarityThreshold",
        "Similarity threshold must be a float with a value between 0 and 1"
      ).isFloat({min: 0, max: 1}),
      check(
        "pages",
        "Pages must be an integer with a value of at least 1"
      ).isInt({min: 1}),
      check(
        "country",
        `Country must be one of the following list: ${countries.join(", ")}`
      ).isIn(countries)
    ],
    (req, res) => {
      console.log("PUT /options - body:", req.body);
      try {
        const errors = validationResult(req).array();
        console.log(errors);
        if (errors.length) {
          console.log(errors);
          res.status(status.UNPROCESSABLE_ENTITY).json({errors: errors});
          return res;
        }
        model.updateOptions(req.body);
        res.status(status.OK).json("Options updated");
      } catch (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
      }
      return res;
    }
  );

  app.post(
    prefix + "/query",
    [
      check("query", "Missing non-empty search query")
        .not()
        .isEmpty()
    ],
    async (req, res) => {
      console.log("POST /query - body:", req.body);
      try {
        const errors = validationResult(req).array();
        if (errors.length) {
          console.log(errors);
          res.status(status.UNPROCESSABLE_ENTITY).json({errors: errors});
          return res;
        }
        const clusters = await model.newQueryResult(req.body.query);
        res.status(status.OK).json(clusters);
      } catch (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
      }
      return res;
    }
  );

  app.get(prefix + "/query", (req, res) => {
    console.log("GET /query");
    try {
      const clusters = model.getQueryResult();
      res.status(status.OK).json(clusters);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });
};
