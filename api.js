const db = require("./db/connection.js")
const express = require("express")
const app = express()

const {getApi, getTopics} = require("./controllers/topics.controllers.js")

const {getArticlesId, getArticles} = require("./controllers/articles.controller.js")

app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticlesId);

app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {

    if (err.code === "22P02") {

      res.status(400).send({ msg: "Bad Request" });
    } else if (err.status && err.msg) {

      res.status(err.status).send({ msg: err.msg });
    } else {

      res.status(500).send({ msg: "Internal Server Error" });
    }
  });
module.exports = app
