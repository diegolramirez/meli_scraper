"use strict";

const axios = require("axios");
const puppeteer = require("puppeteer");

class Model {
  constructor() {
    this.PRICE_CLASS = 'span[class="price-tag-fraction"]';
    this.ITEM_CLASS =
      'a[class="ui-search-item__group__element ui-search-link"]';
  }

  helloWorld(str = "Hello World!") {
    return str;
  }

  inputItemFormatter(name) {
    return encodeURI(name.replace(/\s\s+/g, " ").replace(/\s/g, "-"));
  }

  async scraperBuscador(item, pages = 5, country = "ar") {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    let out = [];
    let i = 0;

    while (i < pages) {
      let url = `https://listado.mercadolibre.com.${country}/${item}/${
        out.length ? `_Desde_${out.length + 1}` : ""
      }`;
      console.log("scraper", url);
      await page.goto(url, {waitUntil: "networkidle2"});

      let data = await page.evaluate(() => {
        let lis = Array.from(
          document.querySelectorAll('li[class="ui-search-layout__item"]')
        );

        return lis.map(li => {
          console.log(this.PRICE_CLASS);
          let price = li.querySelector('span[class="price-tag-fraction"]');
          let item = li.querySelector(
            'a[class="ui-search-item__group__element ui-search-link"]'
          );

          return {
            price: price.innerText,
            name: item.title,
            itemurl: item.href
          };
        });
      });

      out = out.concat(data);
      i++;
    }
    await browser.close();
    return out;
  }

  async scraperItem(itemurl) {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    // console.log("scraperItem", itemurl);
    await page.goto(itemurl);

    let out = {};
    try {
      out.vendor = await page.evaluate(() => {
        return document.querySelectorAll('span[class="ui-pdp-color--BLUE"]')[0]
          .innerText;
      });
    } catch (err) {
      // console.log("no vendor info:", itemurl);
      out.vendor = "n/a";
    }
    await browser.close();
    return out;
  }
}

module.exports = Model;
