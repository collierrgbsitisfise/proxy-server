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
const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
class RedisClient {
    constructor(host) {
        this.redisClient = null;
        this.host = host;
    }
    connect() {
        this.redisClient = redis.createClient(this.host);
    }
    setValue(key, value) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        this.redisClient.set(key, value);
    }
    setExpValue(key, value, seconds = 60 * 60 * 24) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        this.redisClient.set(key, value, 'EX', seconds);
    }
    getValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.redisClient.getAsync(key);
                return {
                    data: result,
                    error: null
                };
            }
            catch (err) {
                return {
                    data: null,
                    error: err
                };
            }
        });
    }
}
exports.default = RedisClient;
//# sourceMappingURL=redis.service.js.map