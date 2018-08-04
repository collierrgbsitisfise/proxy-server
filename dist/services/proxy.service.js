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
class ProxyService {
    constructor() { }
    getProxyList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allProxies = yield proxy_model_1.default.find({}).exec();
                return {
                    data: allProxies,
                    error: null
                };
            }
            catch (err) {
                return {
                    data: err,
                    error: true
                };
            }
        });
    }
}
exports.default = ProxyService;
//# sourceMappingURL=proxy.service.js.map