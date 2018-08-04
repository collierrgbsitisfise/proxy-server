"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_model_1 = require("./../models/proxy.model");
const url = require("url");
exports.proxyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let uri;
    let result;
    const { query } = url.parse(req.url, true);
    uri = query.uri;
    try {
        const allProxies = yield proxy_model_1.default.find({}).exec();
        res.send(allProxies);
    }
    catch (err) {
        res.status(500).send(err);
    }
    // try {
    //   result = await rp.get(uri);
    // } catch (err) {
    //   result = err;
    // }
    // res.send({
    //   Method: req.method,
    //   Body: req.body,
    //   Headers: req.headers,
    //   uri,
    //   result
    // });
});
//# sourceMappingURL=main.cntrl.js.map