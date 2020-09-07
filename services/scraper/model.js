"use strict";

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

  updateOptions(options) {
    if (options.priceRange !== undefined)
      this.matcher.setPriceRange = options.priceRange;
    if (options.nameWeight !== undefined)
      this.matcher.setNameWeight = options.nameWeight;
    if (options.priceWeight !== undefined)
      this.matcher.setPriceWeight = options.priceWeight;
    if (options.minSimilarityScore !== undefined)
      this.matcher.setMinSimilarityScore = options.minSimilarityScore;
    if (options.similarityThreshold !== undefined)
      this.matcher.setSimilarityThreshold = options.similarityThreshold;
    if (options.pages !== undefined) this.scraper.setPages = options.pages;
    if (options.country !== undefined)
      this.scraper.setCountry = options.country;
    // if (options.matcher.priceRange !== undefined)
    //   this.matcher.setPriceRange = options.matcher.priceRange;
    // if (options.matcher.nameWeight !== undefined)
    //   this.matcher.setNameWeight = options.matcher.nameWeight;
    // if (options.matcher.priceWeight !== undefined)
    //   this.matcher.setPriceWeight = options.matcher.priceWeight;
    // if (options.matcher.minSimilarityScore !== undefined)
    //   this.matcher.setMinSimilarityScore = options.matcher.minSimilarityScore;
    // if (options.matcher.similarityThreshold !== undefined)
    //   this.matcher.setSimilarityThreshold = options.matcher.similarityThreshold;
    // if (options.scraper.pages !== undefined)
    //   this.scraper.setPages = options.scraper.pages;
    // if (options.scraper.country !== undefined)
    //   this.scraper.setCountry = options.scraper.country;

    return true;
  }

  defaultOptions() {
    this.scraper.resetProperties();
    this.matcher.resetProperties();

    return true;
  }

  async newQueryResult(query) {
    this.scraper.setQuery = query;
    this.matcher.setItems = await this.scraper.scraper();

    return this.matcher.matcher();
  }

  getQueryResult() {
    return this.matcher.uniqueItems;
  }
}

module.exports = Model;
