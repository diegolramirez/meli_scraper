"use strict";

class Server {
  constructor() {
    //consiguiendo variable de ambiente
  }

  start() {
    const fs = require("fs");
    //leyendo librerias externas
    const express = require("express");
    const bodyParser = require("body-parser");
    const helmet = require("helmet");

    // iniciando express y middlewares
    this.app = express();
    this.app.use(helmet());

    //config bodyParser
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(bodyParser.text());
    this.app.use(
      bodyParser.json({
        type: "application/json",
        limit: "20mb"
      })
    );

    //documentacion
    this.app.use("/", express.static("doc"));
    //Se incorpora carpeta para las imagenes
    this.app.use("/", express.static("files"));

    // inicializando APIs
    // let dirTables = "./services";
    // const dirs = fs.readdirSync(dirTables);
    // for (let i = 0; i < dirs.length; i++) {
    //   let path = dirs[i];
    //   let pathTabla = `${dirTables}/${path}/meli_scraper`;
    //   if (fs.existsSync(pathTabla) && fs.lstatSync(pathTabla).isDirectory()) {
    //     const dirServices = fs.readdirSync(pathTabla);
    //     for (let j = 0; j < dirServices.length; j++) {
    //       let pathService = dirServices[j];
    //       let pathApi = `${pathTabla}/${pathService}/api.js`;
    //       if (fs.existsSync(pathApi)) {
    //         let api = require("." + pathApi);
    //         api(this.app, `/meli_scraper/${path}`, config);
    //       }
    //     }
    //   }
    // }
    let dirServices = "./services";
    let dirss = fs.readdirSync(dirServices);
    for (let i = 0; i < dirss.length; i++) {
      let path = dirss[i];
      let pathTabla = `${dirServices}/${path}`;
      let pathApi = `${pathTabla}/api.js`;
      if (fs.lstatSync(pathTabla).isDirectory() && fs.existsSync(pathApi)) {
        let api = require("." + pathApi);
        api(this.app, `/iterable/${path}`, config);
      }
    }

    // inicializando el server
    this.app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Servidor de ambiente [${process.env.NODE_ENV ||
          "test"}] iniciado en puerto: ${process.env.PORT}`
      );
    });
  }

  close() {
    this.app.close();
    this.appPublico.close();
  }
}

module.exports = new Server();
