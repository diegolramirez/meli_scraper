"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const Matcher = require("./matcher");
const Scraper = require("./scraper");

class Model {
  constructor() {
    this.matcher = new Matcher();
    this.scraper = new Scraper();
  }

  helloWorld() {
    return "Hello World!";
  }

  getOptions() {
    return {
      matcher: {
        priceRange: this.matcher.priceRange,
        nameWeight: this.matcher.nameWeight,
        priceWeight: this.matcher.priceWeight,
        minSimilarityScore: this.matcher.minSimilarityScore,
        similarityThreshold: this.matcher.similarityThreshold
      },
      scraper: {
        pages: this.scraper.pages,
        country: this.scraper.country
      }
    };
  }

  updateOptions() {}

  defaultOptions() {
    this.scraper.resetProperties();
    this.matcher.resetProperties();
  }

  queryResult() {}
}

module.exports = Model;
