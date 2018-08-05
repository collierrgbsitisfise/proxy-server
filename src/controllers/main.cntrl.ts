import * as mongoose from "mongoose";
import { Request, Response } from "express";
import HttpProxyAgent = require("http-proxy-agent");
import * as rp from "request-promise";
import * as url from "url";

import Proxy from "./../models/proxy.model";
import RedisClient from "./../services/redis.service";

const RedisC = new RedisClient("redis://127.0.0.1:6379");
RedisC.connect();

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

  // try {
  //   result = await rp.get(uri);
  // } catch (err) {
  //   res.status(404).send(err.message);
  //   return;
  // }
  
  console.log('it is headers');
  console.log(req.headers);
  result = await getHTML(uri, proxyList, req.headers);
  res.send({
    data: result
  });
};

const getHTML = async (uri: string, proxyList: any[], headers: any): Promise<any> => {
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
      
      result = await rp(options);
    } catch (err) {
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
};
