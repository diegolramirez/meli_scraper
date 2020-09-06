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
const MIN_SIMILARITY_SCORE = 0.9;
const SIMILARITY_THRESHOLD = 0.9;

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
      item.nameStem = item.name.tokenizeAndStem().join(" ");
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

  priceFilter(price) {
    const itemIndexes = this.items
      .filter(
        item => item.price >= price && item.price < price * this.priceRange
      )
      .map(item => this.items.findIndex(ele => ele == item));
    return itemIndexes;
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
      item1.nameStem,
      item2.nameStem
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

    // console.log(similarityVector);
    // console.log(similarityScore);
    return {similarityScore, similarityVector};
  }

  uniqueItemsFormatter() {
    this.uniqueItems.map(cluster => {});
  }

  matcher() {
    this.uniqueItems = [];

    for (let i = 0; i < this.items.length - 1; i++) {
      let mainItem = this.items[i];
      console.log("voy por:", i, mainItem.name);
      let mainPossibleMatches = this.priceFilter(mainItem.price);
      console.log(`tiene ${mainPossibleMatches.length} posibles matches`);

      for (let j of mainPossibleMatches) {
        let subItem = this.items[j];
        if (j === i || subItem.clusterId !== undefined) continue;
        const {similarityScore, similarityVector} = this.similarityScore(
          mainItem,
          subItem
        );

        if (similarityScore >= SIMILARITY_THRESHOLD) {
          if (mainItem.clusterId === undefined) {
            const clusterId = this.uniqueItems.length;
            mainItem.clusterId = clusterId;
            subItem.clusterId = clusterId;
            this.uniqueItems.push({
              clusterId: clusterId,
              items: [mainItem, subItem]
            });
          } else {
            const clusterId = mainItem.clusterId;
            subItem.clusterId = clusterId;
            this.uniqueItems[clusterId].items.push(subItem);
          }
          this.items[i] = mainItem;
          this.items[j] = subItem;
        }
      }
    }

    this.uniqueItemsFormatter();

    return this.uniqueItems;
  }
}

module.exports = Model;
