const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const HomeController = require("./controllers/home_controller");
const app = express();
global.util = require("util");
global.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
require('./routes')(app, {});
app.listen(port, () => {
  console.log('We are live on ' + port);
});
