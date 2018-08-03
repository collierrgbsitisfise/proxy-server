"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db_mongo_connector_1 = require("./db.mongo.connector");
const mainCtrl = require("./controllers/main.cntrl");
const app = express();
app.set("port", process.env.PORT || 5555);
/*connect to mongo host*/
const db = new db_mongo_connector_1.default('ds247330.mlab.com', 'easy-links-db', 'admin', 'vadim1');
db.connect()
    .then(res => console.log(res))
    .catch(err => console.log('Error db connection...', err));
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.all("*", mainCtrl.proxyRequest);
app.listen(app.get("port"), () => {
    console.log("run...");
});
//# sourceMappingURL=app.js.map