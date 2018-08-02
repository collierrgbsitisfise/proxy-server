import * as mongoose from "mongoose";
import { Request, Response } from "express";
import * as rp from "request-promise";
import * as url from "url";

export const proxyRequest = async (req: Request, res: Response) => {
  let uri: any;
  let result: any;

  const { query } = url.parse(req.url, true);
  
  uri = query.uri;
  
  try {
    result = await rp.get(uri);
  } catch (err) {
    result = err;
  }
  res.send({
    Method: req.method,
    Body: req.body,
    Headers: req.headers,
    uri,
    result
  });
};
