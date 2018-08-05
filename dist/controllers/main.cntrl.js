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
const HttpProxyAgent = require("http-proxy-agent");
const rp = require("request-promise");
const url = require("url");
const proxy_model_1 = require("./../models/proxy.model");
const redis_service_1 = require("./../services/redis.service");
const RedisC = new redis_service_1.default("redis://127.0.0.1:6379");
RedisC.connect();
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
    // try {
    //   result = await rp.get(uri);
    // } catch (err) {
    //   res.status(404).send(err.message);
    //   return;
    // }
    console.log('it is headers');
    console.log(req.headers);
    result = yield getHTML(uri, proxyList, req.headers);
    res.send({
        data: result
    });
});
const getHTML = (uri, proxyList, headers) => __awaiter(this, void 0, void 0, function* () {
    let result;
    let isError = false;
    // try {
    //   result = await rp.get(uri);
    // } catch (err) {
    //   isError = true;
    // }
    // if (!isError) {
    //   return {
    //     data: result,
    //     error: null
    //   }
    // }
    proxyList = proxyList.filter(proxy => proxy.get("type") === "http");
    for (let i = 0; i < 10; i++) {
        try {
            console.log(uri);
            let proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
            let agent = new HttpProxyAgent(`http://${proxy.ip}:${proxy.port}`);
            headers.host = `${proxy.ip}:${proxy.port}`;
            let options = {
                uri,
                method: "GET",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
                },
                agent: agent,
                timeout: 10000,
                followRedirect: true
            };
            result = yield rp(options);
        }
        catch (err) {
            console.log("I am in error ", i);
            console.log(err.message);
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