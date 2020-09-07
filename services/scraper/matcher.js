"use strict";

const natural = require("natural");
natural.PorterStemmer.attach();

// constants for default values
const DEFUALT_PRICE_RANGE = 1.2;
const DEFUALT_NAME_WEIGHT = 3;
const DEFUALT_PRICE_WEIGHT = 2;
const DEFUALT_MIN_SIMILARITY_SCORE = 0.85;
const DEFUALT_SIMILARITY_THRESHOLD = 0.9;

class Matcher {
  constructor(items = []) {
    this.items = items;
    this.uniqueItems = [];
    this.resetProperties();
  }

  set setItems(items) {
    this.items = items;
    this.itemsPreProcess();
  }

  set setPriceRange(priceRange) {
    this.priceRange = priceRange;
  }

  set setNameWeight(nameWeight) {
    this.nameWeight = nameWeight;
    this.maxNorm = this.calcMaxNorm();
  }

  set setPriceWeight(priceWeight) {
    this.priceWeight = priceWeight;
    this.maxNorm = this.calcMaxNorm();
  }

  set setMinSimilarityScore(minSimilarityScore) {
    this.minSimilarityScore = minSimilarityScore;
  }

  set setSimilarityThreshold(similarityThreshold) {
    this.similarityThreshold = similarityThreshold;
  }

  calcMaxNorm() {
    return Math.sqrt(
      [this.nameWeight, this.priceWeight]
        .map(ele => Math.pow(ele, 2))
        .reduce((a, b) => a + b, 0)
    );
  }

  resetProperties() {
    this.priceRange = DEFUALT_PRICE_RANGE;
    this.nameWeight = DEFUALT_NAME_WEIGHT;
    this.priceWeight = DEFUALT_PRICE_WEIGHT;
    this.maxNorm = this.calcMaxNorm();
    this.minSimilarityScore = DEFUALT_MIN_SIMILARITY_SCORE;
    this.similarityThreshold = DEFUALT_SIMILARITY_THRESHOLD;
  }

  itemNameFormatter() {
    this.items = this.items.map(item => {
      item.nameStem = item.name.tokenizeAndStem().join(" ");
      return item;
    });
  }

  itemPriceSorter() {
    this.items.sort((a, b) => (a.price > b.price ? 1 : -1));
  }

  itemsPreProcess() {
    this.itemNameFormatter();
    this.itemPriceSorter();
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
    const nameSimilarityScore = this.nameSimilarityScore(
      item1.nameStem,
      item2.nameStem
    );
    const priceSimilarityScore = this.priceSimilarityScore(
      item1.price,
      item2.price
    );
    const similarityVector = [
      nameSimilarityScore * this.nameWeight,
      priceSimilarityScore * this.priceWeight
    ];

    let similarityScore = 0;
    if (
      !(
        nameSimilarityScore < this.minSimilarityScore ||
        priceSimilarityScore < this.minSimilarityScore
      )
    ) {
      similarityScore =
        Math.sqrt(
          similarityVector
            .map(pos => Math.pow(pos, 2))
            .reduce((a, b) => a + b, 0)
        ) / this.maxNorm;
    }
    return similarityScore;
  }

  uniqueItemsFormatter() {
    this.uniqueItems = this.uniqueItems.map(cluster => {
      cluster.itemCount = cluster.items.length;
      cluster.minPrice = Math.min(...cluster.items.map(ele => ele.price));
      cluster.maxPrice = Math.max(...cluster.items.map(ele => ele.price));

      return cluster;
    });
  }

  matcher() {
    this.uniqueItems = [];

    for (let i = 0; i < this.items.length; i++) {
      let mainItem = this.items[i];
      if (mainItem.clusterId !== undefined) continue;
      // console.log("voy por:", i, mainItem.name);
      let mainPossibleMatches = this.priceFilter(mainItem.price);
      // console.log(`tiene ${mainPossibleMatches.length} posibles matches`);

      for (let j of mainPossibleMatches) {
        let subItem = this.items[j];
        if (j === i || subItem.clusterId !== undefined) continue;
        const similarityScore = this.similarityScore(mainItem, subItem);

        if (similarityScore >= this.similarityThreshold) {
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

module.exports = Matcher;
