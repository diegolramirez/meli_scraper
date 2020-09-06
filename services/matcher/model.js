"use strict";

const natural = require("natural");
natural.PorterStemmer.attach();

class Model {
  constructor(items) {
    this.items = items;
    this.uniqueItems = [];
    this.itemNameFormatter();
  }

  set setItems(items) {
    this.items = items;
  }

  itemNameFormatter() {
    this.items = this.items.map(item => {
      item.nameMatch = item.name.tokenizeAndStem().join(" ");
      return item;
    });
  }
}

module.exports = Model;
