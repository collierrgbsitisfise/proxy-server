import * as mongoose from "mongoose";
import { Request, Response } from "express";
import * as rp from "request-promise";
import * as url from "url";

import Proxy from "./../models/proxy.model";
import RedisClient from './../services/redis.service';

const RedisC = new RedisClient("redis://127.0.0.1:6379");
RedisC.connect();

export const proxyRequest = async (req: Request, res: Response) => {
  let uri: any;
  let result: any;

  const { query } = url.parse(req.url, true);

  uri = query.uri;

  RedisC.setValue("test", "big data bid data");
  RedisC.getValue("test").then(res => {
    console.log("get value from redis");
    console.log(res);
  });

  try {
    const allProxies = await Proxy.find({}).exec();
    res.send(allProxies);
  } catch (err) {
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
};
