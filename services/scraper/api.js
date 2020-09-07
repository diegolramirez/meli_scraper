"use strict";

const status = require("http-status");
const Model = require("./model");
const {check, oneOf, validationResult} = require("express-validator");
const countries = require("../../utils/countries");

module.exports = async function(app, prefix) {
  const model = new Model();

  /**
   * @swagger
   * /meli_scraper/scraper/options:
   *    get:
   *      description: Returns all of scraper and matcher algorithms current parameters.
   *    responses:
   *      '200':
   *        description: Parameters returned.
   *      '500':
   *        description: API failed unexpectedly.
   */
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

  /**
   * @swagger
   * /meli_scraper/scraper/options:
   *    put:
   *      description: Update scraper and matcher algorithms parameters to custom values
   *    parameters:
   *      - name: priceRange
   *        in: body
   *        description: Percentage of price that tow items can be apart. i.e `1.20` means 20%. Mus be a float greater or equal to 1.
   *        required: false
   *        schema:
   *          type: number
   *          format: float
   *      - name: nameWeight
   *        in: body
   *        description: Custom weight of name variable in overall similarity score. Must be an integer greater or equal than 1.
   *        required: false
   *        schema:
   *          type: integer
   *          format: int32
   *      - name: priceWeight
   *        in: body
   *        description: Custom weight of price variable in overall similarity score. Must be an integer greater or equal than 1.
   *        required: false
   *        schema:
   *          type: integer
   *          format: int32
   *      - name: minSimilarityScore
   *        in: body
   *        description: Minimum similarity score each name and price must have. If any is lower then the the matching is rejected. Must be a float between 0 and 1.
   *        required: false
   *        schema:
   *          type: number
   *          format: float
   *      - name: similarityThreshold
   *        in: body
   *        description: Overall minimum similarity score needed for a pair of items to be matched. Must be a float between 0 and 1.
   *        required: false
   *        schema:
   *          type: number
   *          format: float
   *      - name: pages
   *        in: body
   *        description: Amount of result pages to be scraped. Must be an integer greater or equal than 1.
   *        required: false
   *        schema:
   *          type: integer
   *          format: int32
   *      - name: country
   *        in: body
   *        description: Which country's marketplace is going to be consulted. Must be one value of the following list `[ar,bo,br,cl,co,cr,do,ec,gt,hn,mx,ni,pa,py,pe,sv,uy,ve]`
   *        required: false
   *        schema:
   *          type: string
   *          format: string
   *    responses:
   *      '200':
   *        description: Options successfully updated
   *      '500':
   *        description: API failed unexpectedly
   */
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
      )
        .optional()
        .isFloat({min: 1}),
      check(
        "nameWeight",
        "Name weight must be an integer with a value of at least 1"
      )
        .optional()
        .isInt({min: 1}),
      check(
        "priceWeight",
        "Price weight must be an integer with a value of at least 1"
      )
        .optional()
        .isInt({min: 1}),
      check(
        "minSimilarityScore",
        "Min similarity score must be a float with a value between 0 and 1"
      )
        .optional()
        .isFloat({min: 0, max: 1}),
      check(
        "similarityThreshold",
        "Similarity threshold must be a float with a value between 0 and 1"
      )
        .optional()
        .isFloat({min: 0, max: 1}),
      check("pages", "Pages must be an integer with a value of at least 1")
        .optional()
        .isInt({min: 1}),
      check(
        "country",
        `Country must be one of the following list: ${countries.join(", ")}`
      )
        .optional()
        .isIn(countries)
    ],
    (req, res) => {
      console.log("PUT /options - body:", req.body);
      try {
        const errors = validationResult(req).array();
        if (errors.length) {
          console.log(errors);
          res.status(status.UNPROCESSABLE_ENTITY).json({errors: errors});
          return res;
        }
        model.updateOptions(req.body);
        res.status(status.OK).json("Options successfully updated");
      } catch (err) {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
      }
      return res;
    }
  );

  /**
   * @swagger
   * /meli_scraper/scraper/default:
   *    put:
   *      description: Restore all of scraper and matcher algorithms parameters to their default value.
   *    responses:
   *      '200':
   *        description: Default options restored
   *      '500':
   *        description: API failed unexpectedly
   */
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

  /**
   * @swagger
   * /meli_scraper/scraper/query:
   *    post:
   *      description: Returns all of scraper and matcher algorithms current parameters.
   *    parameters:
   *      - name: query
   *        in: body
   *        description: Item name to be searched.
   *        required: true
   *        schema:
   *          type: string
   *          format: string
   *    responses:
   *      '200':
   *        description: Parameters returned.
   *      '500':
   *        description: API failed unexpectedly.
   */
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

  /**
   * @swagger
   * /meli_scraper/scraper/query:
   *    get:
   *      description: Returns all of scraper and matcher algorithms current parameters.
   *    responses:
   *      '200':
   *        description: Parameters returned.
   *      '500':
   *        description: API failed unexpectedly.
   */
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
