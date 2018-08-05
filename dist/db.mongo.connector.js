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
const mongoose = require("mongoose");
class dbMongoConnector {
    constructor(host, db, userName, password, port = '47330') {
        this.port = '47330';
        this.protocol = 'mongodb';
        this.host = host;
        this.db = db;
        this.userName = userName;
        this.password = password;
        this.port = port;
    }
    formatConnectionUrl() {
        return `${this.protocol}://${this.userName}:${this.password}@${this.host}:47330/${this.db}`;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUrl = this.formatConnectionUrl();
            const connectPromise = function (resolve, reject) {
                mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve('connected');
                });
            };
            return new Promise(connectPromise);
        });
    }
}
exports.default = dbMongoConnector;
//# sourceMappingURL=db.mongo.connector.js.map