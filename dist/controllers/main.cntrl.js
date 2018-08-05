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
const rp = require("request-promise");
const url = require("url");
const proxy_model_1 = require("./../models/proxy.model");
const redis_service_1 = require("./../services/redis.service");
const RedisC = new redis_service_1.default("redis://127.0.0.1:6379");
RedisC.connect();
exports.pongRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let redisProxy = yield RedisC.getValue("proxy-list");
        res.send(redisProxy);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.proxyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let uri;
    let result;
    let proxyList;
    const { query } = url.parse(req.url, true);
    uri = query.uri;
    //verify if uri was provided
    if (!uri) {
        res.status(404).send("Provide uri query parameter");
    }
    let dataFromRedis = yield RedisC.getValue("proxy-list");
    if (dataFromRedis.data && !dataFromRedis.error) {
        proxyList = dataFromRedis.data;
    }
    try {
        const allProxies = yield proxy_model_1.default.find({}).exec();
        RedisC.setExpValue("proxy-list", allProxies, 60 * 60 * 6);
        proxyList = allProxies;
    }
    catch (err) {
        res.status(500).send(err);
    }
    result = yield getHTML(uri, proxyList);
    res.send({
        data: result
    });
});
const getHTML = (uri, proxyList) => __awaiter(this, void 0, void 0, function* () {
    let result;
    let isError = false;
    try {
        result = yield rp.get(uri);
    }
    catch (err) {
        isError = true;
    }
    if (!isError) {
        return {
            data: result,
            error: null
        };
    }
    proxyList = proxyList.filter(proxy => proxy.get("type") === "http");
    for (let i = 0; i < 5; i++) {
        try {
            let proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
            result = yield rp.get({
                url: uri,
                method: 'GET',
                timeout: 3000,
                followRedirect: true,
                proxy: `http://${proxy.ip}:${proxy.port}`
            });
        }
        catch (err) {
            console.log('ERROR', i);
            isError = true;
        }
        if (!isError) {
            return {
                data: result,
                error: null
            };
        }
    }
    return {
        data: null,
        error: true
    };
});
//# sourceMappingURL=main.cntrl.js.map