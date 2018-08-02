import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";

import * as mainCtrl from './controllers/main.cntrl';

const app: any = express();

app.set("port", process.env.PORT || 5555);

app.use(cors());
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.all("*", mainCtrl.proxyRequest);

app.listen(app.get("port"), () => {
  console.log("run...");
});
