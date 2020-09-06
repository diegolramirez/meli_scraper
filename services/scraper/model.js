"use strict";

// external libraries
const puppeteer = require("puppeteer");

// constants for html element classes to be searched
const ITEM_LIST_ELEMENT = 'li[class="ui-search-layout__item"]';
const ITEM_ELEMENT = 'a[class="ui-search-item__group__element ui-search-link"]';
const PRICE_MAIN_ELEMENT = 'span[class="price-tag-fraction"]';
const PRICE_DECIMAL_ELEMENT = 'span[class="price-tag-cents"]';
const VENDOR_ELEMENT = 'span[class="ui-pdp-color--BLUE"]';
const SIMULTANEOUS_REQUESTS = 10;

class Model {
  constructor(query, pages = 5, country = "ar") {
    this.query = this.queryFormatter(query);
    this.pages = pages;
    this.country = country;
    this.items = [];
  }

  // setters - no getters
  set setQuery(query) {
    this.query = this.queryFormatter(query);
  }

  set setPages(pages) {
    this.pages = pages;
  }

  set setCountry(country) {
    this.country = country;
  }

  queryFormatter(query) {
    return encodeURI(
      query
        .trim()
        .replace(/\s\s+/g, " ")
        .replace(/\s/g, "-")
    );
  }

  // priceFormatter(main, decimal = 0) {
  //   return parseFloat(main.replace(".", "").concat(".", decimal));
  // }

  async scraperSearch() {
    // reset list of scraped items
    this.items = [];

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    let i = 0;

    while (i < this.pages) {
      let url = `https://listado.mercadolibre.com.${this.country}/${
        this.query
      }/${this.items.length ? `_Desde_${this.items.length + 1}` : ""}`;
      console.log("scraperSearch - url:", url);

      await page.goto(url, {waitUntil: "networkidle2"});

      let data = await page.evaluate(
        (
          itemListElement,
          itemElement,
          priceMainElement,
          priceDecimalElement
        ) => {
          const priceFormatter = (main, decimal = 0) => {
            return parseFloat(main.replace(".", "").concat(".", decimal));
          };

          let lis = Array.from(document.querySelectorAll(itemListElement));

          return lis.map(li => {
            let item = li.querySelector(itemElement);
            let priceMain = li.querySelector(priceMainElement);
            let priceDecimal = li.querySelector(priceDecimalElement);

            return {
              price: priceDecimal
                ? priceFormatter(priceMain.innerText, priceDecimal.innerText)
                : priceFormatter(priceMain.innerText),
              name: item.title,
              itemurl: item.href
            };
          });
        },
        ITEM_LIST_ELEMENT,
        ITEM_ELEMENT,
        PRICE_MAIN_ELEMENT,
        PRICE_DECIMAL_ELEMENT
      );

      if (!data.length) break;

      this.items = this.items.concat(data);
      i++;
    }
    await browser.close();
    // return this.items;
  }

  async scraperItem(itemurl) {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    // console.log("scraperItem", itemurl);
    await page.goto(itemurl);

    let out = {};
    try {
      out.vendor = await page.evaluate(vendorElement => {
        return document.querySelectorAll(vendorElement)[0].innerText;
      }, VENDOR_ELEMENT);
    } catch (err) {
      // console.log("no vendor info:", itemurl);
      out.vendor = "n/a";
    }
    await browser.close();
    return out;
  }

  async itemsExtraInfo() {
    let tmp = [];
    for (let i = 0; i < this.items.length; i += SIMULTANEOUS_REQUESTS) {
      console.log("voy por", i);
      tmp = tmp.concat(
        await Promise.all(
          this.items.slice(i, i + SIMULTANEOUS_REQUESTS).map(async item => {
            item.vendor = (await this.scraperItem(item.itemurl)).vendor;
            return item;
          })
        )
      );
    }
    this.items = tmp;
  }
}

module.exports = Model;
