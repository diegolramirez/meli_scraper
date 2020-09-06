"use strict";

const natural = require("natural");
// const similarity = require("compute-cosine-similarity");
natural.PorterStemmer.attach();
// natural.PorterStemmerES.attach();

const NAME_WEIGHT = 3;
const PRICE_WEIGHT = 2;
const MAX_NORM = Math.sqrt(
  [NAME_WEIGHT, PRICE_WEIGHT]
    .map(pos => Math.pow(pos, 2))
    .reduce((a, b) => a + b, 0)
);
const MIN_SIMILARITY_SCORE = 0.5;
const SIMILARITY_THRESHOLD = 0.7;

console.log("MAX_NORM", MAX_NORM);

class Model {
  constructor(items, priceRange = 1.25) {
    this.items = items;
    this.uniqueItems = [];
    this.priceRange = priceRange;
    this.itemsPreProcess();
  }

  set setItems(items) {
    this.items = items;
  }

  set setPriceRange(priceRange) {
    this.priceRange = priceRange;
  }

  itemNameFormatter() {
    this.items = this.items.map(item => {
      item.nameMatch = item.name.tokenizeAndStem().join(" ");
      return item;
    });
  }

  itemSorter() {
    this.items.sort((a, b) => (a.price > b.price ? 1 : -1));
  }

  itemsPreProcess() {
    this.itemNameFormatter();
    this.itemSorter();
  }

  priceFilter(index) {
    const arr = this.items.filter(
      item =>
        item.price >= this.items[index].price &&
        item.price < this.items[index].price * this.priceRange
    );
    console.log(arr.length);
    console.log(arr);
    return arr;
  }

  nameSimilarityScore(str1, str2) {
    return natural.JaroWinklerDistance(str1, str2);
  }

  priceSimilarityScore(num1, num2) {
    if (num1 === num2) return 1;
    if (num1 === 0 || num2 === 0) return 0;
    const min = Math.min(num2, num1);
    const max = Math.max(num2, num1);
    return 1 - Math.abs((max - min) / max);
  }

  similarityScore(item1, item2) {
    // console.log("item1", item1);
    // console.log("item2", item2);
    const nameSimilarityScore = this.nameSimilarityScore(
      item1.nameMatch,
      item2.nameMatch
    );
    const priceSimilarityScore = this.priceSimilarityScore(
      item1.price,
      item2.price
    );
    const similarityVector = [
      nameSimilarityScore * NAME_WEIGHT,
      priceSimilarityScore * PRICE_WEIGHT
    ];

    let similarityScore = 0;
    if (
      !(
        nameSimilarityScore < MIN_SIMILARITY_SCORE ||
        priceSimilarityScore < MIN_SIMILARITY_SCORE
      )
    ) {
      similarityScore =
        Math.sqrt(
          similarityVector
            .map(pos => Math.pow(pos, 2))
            .reduce((a, b) => a + b, 0)
        ) / MAX_NORM;
    }

    console.log(similarityVector);
    console.log(similarityScore);
    return {similarityScore, similarityVector};
  }

  matcher() {}
}

module.exports = Model;
