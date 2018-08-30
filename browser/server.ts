import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();

const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow these verbs
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control"
  );

  next();
};

app.use(allowCrossDomain);

routes(app, {});
app.listen(port, () => {
  console.log("We are live on " + port);
});
