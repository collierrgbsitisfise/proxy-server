import * as mongoose from "mongoose";
import { Request, Response } from "express";
import HttpProxyAgent = require("http-proxy-agent");
import * as rp from "request-promise";
import * as url from "url";

import Proxy from "./../models/proxy.model";
import RedisClient from "./../services/redis.service";

const RedisC = new RedisClient("redis://127.0.0.1:6379");
RedisC.connect();

export const pongRequest = async (req: Request, res: Response) => {
  try {
    let redisProxy = await RedisC.getValue("proxy-list");
    res.send(redisProxy);
  } catch  (err) {
    res.status(500).send(err);
  }
}

export const proxyRequest = async (req: Request, res: Response) => {
  let uri: any;
  let result: any;
  let proxyList: any;

  const { query } = url.parse(req.url, true);

  uri = query.uri;

  //verify if uri was provided
  if (!uri) {
    res.status(404).send("Provide uri query parameter");
  }

  let dataFromRedis = await RedisC.getValue("proxy-list");

  if (dataFromRedis.data && !dataFromRedis.error) {
    proxyList = dataFromRedis.data;
  }

  try {
    const allProxies = await Proxy.find({}).exec();

    RedisC.setExpValue("proxy-list", allProxies, 60 * 60 * 6);
    proxyList = allProxies;
  } catch (err) {
    res.status(500).send(err);
  }
  
  result = await getHTML(uri, proxyList);
  res.send({
    data: result
  });
};

const getHTML = async (uri: string, proxyList: any[]): Promise<any> => {
  let result;
  let isError = false;

  try {
    result = await rp.get(uri);
  } catch (err) {
    isError = true;
  }

  if (!isError) {
    return {
      data: result,
      error: null
    }
  }
  
  proxyList = proxyList.filter(proxy => proxy.get("type") === "http");
  for (let i = 0; i < 5; i++) {
    try {
      let proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
      result = await rp.get({
        url: uri,
        method: 'GET',
        timeout: 3000,
        followRedirect: true,
        proxy: `http://${proxy.ip}:${proxy.port}`
      });
    } catch (err) {
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
};
