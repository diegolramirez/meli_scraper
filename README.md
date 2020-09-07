# MeLi Scraper

This is an API that gathers items listed for sale at <a href='https://www.mercadolibre.com.ar/'>Mercado Libre</a> and tries to cluster same products together.

This process  is split into two steps:
<ol>
<li><strong>Web Scraper:</strong> get an item's name as a parameter, this is searched in Mercado Libre marketplace. Then downloads and stores all results in the first <i>n</i> pages.</li>
<li><strong>Item Matcher:</strong> based on the gathered product list clusters them into same product groups, this in order to determine unique listed items. The clustering is based in name and price comparison.</li>
</ol>

The following is a list of instructions to use this API.

## Requirements

    node v12.18.3+
    npm 6.14.8+

It is possible to run with older versions of `node` and `npm` but it is not guaranteed. For more information regarding installing `node` and `npm` follow this <a href='https://docs.npmjs.com/downloading-and-installing-node-js-and-npm'>link</a>.

## Install

    npm install

## Run the app

    npm start

After the server is up and running just call the endpoint `POST meli_scraper/scraper/query/` with a body containing the property `query` and wait for the results.

To retrieve the results of the last queried item call `GET meli_scraper/scraper/query/`.

A postman collection containing templates for all requests may be found under `utils` folder.

## Documentation

A full list of endpoints and their characteristics can be found locally at `utils/Swagger UI.html`. Via Github at the following <a href='https://github.com/diegolramirez/meli_scraper/blob/master/utils/Swagger%20UI.html'>link</a>. Or after starting the server by accessing <a href='http://localhost:3000/api-docs/'>http://localhost:3000/api-docs/</a>.

## Matcher algorithm description

Item matching and clustering is decided by evaluating how <i>similar</i> are the <i>name</i> and <i>price</i> of the items listed. The similarity is computed with the help of a <i>similarity vector</i>, from which the norm (normalized to 1), called <i>similarity score</i>, is the deciding factor for the classification. A norm equal to `0` means the products are completely different, a norm equal to `1` means the products are exactly the same.

To obtain this score one has to obtain the vector's elements first, and then compute the norm. This vector is composed of two elements: <i>name similarity score</i> and <i>price similarity score</i>.

The name similarity score is obtained by computing the Jaro-Winkler distance between the names of two different items. This value always lie in the interval `[0,1]`.

The price similarity score is obtained by computing the percentage difference, followed by a linear transformation, of the prices of two different items. This value always lie in the interval `[0,1]`.

## Default parameters

Each part of the process (scraper and matcher) has variables that may be modified in order to achieve different levels of accuracy. One may check the current parameters via `GET meli_scraper/scraper/options/`, update them to custom values via `PUT meli_scraper/scraper/options/` or restore them to default values via `PUT meli_scraper/scraper/default/`.

The scraper parameters are the following:

<ul>
<li><strong>country:</strong> which country's marketplace is going to be consulted. Must be one value of the following list: [ar,bo,br,cl,co,cr,do,ec,gt,hn,mx,ni,pa,py,pe,sv,uy,ve]</li>
<li><strong>pages:</strong> amount of result pages to be scraped. Must be an integer greater or equal than 1.</li>
</ul>

The matcher parameters are the following:

<ul>
<li><strong>priceRange:</strong> percentage of price that two items can be apart. i.e 1.20 means 20%. Mus be a float greater or equal than 1.</li>
<li><strong>nameWeight:</strong> custom weight of name variable in overall similarity score. Must be an integer greater or equal than 1.</li>
<li><strong>priceWeight:</strong> custom weight of price variable in overall similarity score. Must be an integer greater or equal than 1.</li>
<li><strong>minSimilarityScore:</strong> minimum similarity score each name and price must have. If any is lower then the matching is rejected. Must be a float between 0 and 1.</li>
<li><strong>similarityThreshold:</strong> overall minimum similarity score needed for a pair of items to be matched. Must be a float between 0 and 1.</li>
</ul>

These parameters have the following default values:

    {
        "matcher": {
            "priceRange": 1.2,
            "nameWeight": 3,
            "priceWeight": 2,
            "minSimilarityScore": 0.85,
            "similarityThreshold": 0.9
        },
        "scraper": {
            "pages": 5,
            "country": "ar"
        }
    }
