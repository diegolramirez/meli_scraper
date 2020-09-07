# MeLi Scraper

This is an API that gathers items listed for sale at <a href='https://www.mercadolibre.com.ar/'>Mercado Libre</a> and tries to cluster same products together.

This process  is split into two steps:
<ol>
<li><strong>Web Scraper:</strong> get an item's name as a parameter, this is searched in Mercado Libre marketplace. Then downloads and stores all results in the first <i>n</i> pages.</li>
<li><strong>Item Matcher:</strong> based on the gathered product list clusters them into same product groups, this in order to determine unique listed items. The clustering is based in name and price comparison.</li>
</ol>

The following is a list of instructions to use this API.

## Install

    npm install

## Run the app

    npm start

## Documentation

A full list of endpoints and their characteristics can be found locally at `utils/Swagger UI.html`. Via Github at the following <a href='https://github.com/diegolramirez/meli_scraper/blob/master/utils/Swagger%20UI.html'>link</a>. Or after starting the server by accessing <a href='http://localhost:3000/api-docs/'>http://localhost:3000/api-docs/</a>.
