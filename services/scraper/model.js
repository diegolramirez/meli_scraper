"use strict";

const axios = require("axios");
const puppeteer = require("puppeteer");

class Model {
  constructor() {
    // pass
  }

  helloWorld(str = "Hello World!") {
    return str;
  }

  async scraper(item, country = "ar") {
    let url = `https://celulares.mercadolibre.com.${country}/${item}/`;
    let browser = puppeteer.launch();
    let page = browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});
    await page.evaluate(() => {});
  }
}

module.exports = Model;
