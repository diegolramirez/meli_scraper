
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
      "/options": {
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
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "nameWeight",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "priceWeight",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "minSimilarityScore",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "similarityThreshold",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "name": "pages",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "country",
            "in": "body",
            "description": "Price range to look for possible item matches. 1.20 implies 20% tolerance.",
            "required": false,
            "schema": {
              "type": "string",
              "format": "string"
            }
          }
        ]
      },
      "/default": {
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
      "/query": {
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
