
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "info": {
      "version": "1.0.0",
      "title": "MeLi Scraper",
      "description": "Scraper and matcher of MeLi's products",
      "contact": {
        "name": "Diego Ramírez-Milano"
      },
      "servers": [
        "http://localhost:3000"
      ]
    },
    "swagger": "2.0",
    "paths": {
      "/meli_scraper/scraper/options": {
        "get": {
          "description": "Returns all of scraper and matcher algorithms current parameters."
        },
        "responses": {
          "200": {
            "description": "Options successfully updated"
          },
          "500": {
            "description": "API failed unexpectedly"
          }
        },
        "put": {
          "description": "Update scraper and matcher algorithms parameters to custom values"
        },
        "parameters": [
          {
            "name": "priceRange",
            "in": "body",
            "description": "Percentage of price that tow items can be apart. i.e `1.20` means 20%. Mus be a float greater or equal to 1.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "nameWeight",
            "in": "body",
            "description": "Custom weight of name variable in overall similarity score. Must be an integer greater or equal than 1.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "priceWeight",
            "in": "body",
            "description": "Custom weight of price variable in overall similarity score. Must be an integer greater or equal than 1.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "minSimilarityScore",
            "in": "body",
            "description": "Minimum similarity score each name and price must have. If any is lower then the the matching is rejected. Must be a float between 0 and 1.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "similarityThreshold",
            "in": "body",
            "description": "Overall minimum similarity score needed for a pair of items to be matched. Must be a float between 0 and 1.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "pages",
            "in": "body",
            "description": "Amount of result pages to be scraped. Must be an integer greater or equal than 1.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "country",
            "in": "body",
            "description": "Which country's marketplace is going to be consulted. Must be one value of the following list `[ar,bo,br,cl,co,cr,do,ec,gt,hn,mx,ni,pa,py,pe,sv,uy,ve]`",
            "required": false,
            "schema": {
              "type": "string",
              "format": "string"
            }
          }
        ]
      },
      "/meli_scraper/scraper/default": {
        "put": {
          "description": "Restore all of scraper and matcher algorithms parameters to their default value."
        },
        "responses": {
          "200": {
            "description": "Default options restored"
          },
          "500": {
            "description": "API failed unexpectedly"
          }
        }
      },
      "/meli_scraper/scraper/query": {
        "post": {
          "description": "Returns all of scraper and matcher algorithms current parameters."
        },
        "responses": {
          "200": {
            "description": "Parameters returned."
          },
          "500": {
            "description": "API failed unexpectedly."
          }
        },
        "get": {
          "description": "Returns all of scraper and matcher algorithms current parameters."
        }
      }
    },
    "definitions": {},
    "responses": {},
    "parameters": {},
    "securityDefinitions": {},
    "tags": []
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
