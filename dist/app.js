"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mainCtrl = require("./controllers/main.cntrl");
const app = express();
app.set("port", process.env.PORT || 5555);
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