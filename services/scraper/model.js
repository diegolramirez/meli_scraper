"use strict";

// external libraries
const puppeteer = require("puppeteer");

// constants for html element classes to be searched
const ITEM_LIST_ELEMENT = 'li[class="ui-search-layout__item"]';
const ITEM_ELEMENT = 'a[class="ui-search-item__group__element ui-search-link"]';
const PRICE_ELEMENT = 'span[class="price-tag-fraction"]';
const VENDOR_ELEMENT = 'span[class="ui-pdp-color--BLUE"]';

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

  // priceFormatter(main, decimals = 0) {
  //   return parseFloat(price.replace);
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
        (itemListElement, itemElement, priceElement) => {
          let lis = Array.from(document.querySelectorAll(itemListElement));

          return lis.map(li => {
            console.log(this.PRICE_CLASS);
            let item = li.querySelector(itemElement);
            let price = li.querySelector(priceElement);

            return {
              price: price.innerText,
              name: item.title,
              itemurl: item.href
            };
          });
        },
        ITEM_LIST_ELEMENT,
        ITEM_ELEMENT,
        PRICE_ELEMENT
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
}

module.exports = Model;
