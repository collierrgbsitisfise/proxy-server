import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";
import dbMongoConnector from './db.mongo.connector';
import * as mainCtrl from './controllers/main.cntrl';

const app: any = express();

app.set("port", process.env.PORT || 5555);

/*connect to mongo host*/
const db = new dbMongoConnector('ds247330.mlab.com', 'easy-links-db', 'admin', 'vadim1');
db.connect()
  .then(res => console.log(res))
  .catch(err => console.log('Error db connection...',err));

/*midlewars*/
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
