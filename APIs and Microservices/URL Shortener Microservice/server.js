"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
const dns = require("dns");

// Require dotenv for acceess data from .env file in local enviroment.
// No need to do this for development on online platform like Glitch.
require('dotenv').config();

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

var port = process.env.PORT || 3000;

//Connecting to database.
mongoose
  .connect(process.env.MONGOLAB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//Mongoose Schema
const UrlSchema = new mongoose.Schema({
  url: String,
  shortUrl: Number
});
//Mongoose Model
const Url = mongoose.model("Url", UrlSchema);

app.post("/api/shorturl/new", (req, res) => {
  const REPLACE_REGEX = /^https?:\/\//i;
  let url = req.body.url.replace(REPLACE_REGEX, "");
  dns.lookup(url, (err, address, family) => {
    if (err) {
      res.json({ error: "Invalid Format!" });
    } else if (url === "") {
      res.json({ error: "Can't be Empty! :/" });
    } else {
      Url.findOne({ url: url }, (err, found) => {
        if (!found) {
          Url.find().count((err, count) => {
            if (err) console.log(err);
            Url.create({ url: url, shortUrl: count++ }, (err, createdUrl) => {
              if (err) {
                console.log(err);
              } else {
                res.json({
                  url: createdUrl.url,
                  ShortUrl: createdUrl.shortUrl
                });
              }
            });
          });
        } else {
          res.json({ url: found.url, ShortUrl: found.shortUrl });
        }
      });
    }
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  var requestedId = parseInt(req.params.id);
  Url.findOne({ shortUrl: req.params.id }, (err, foundUrl) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("https://" + foundUrl.url);
    }
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
