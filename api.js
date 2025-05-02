const db = require("./db/connection.js")
const express = require("express")
const app = express()
// const {handlePSQLErrors, handleServerErrors, handleCustomErrors} = require("./errors.js")
const {getApi, getTopics} = require("./controllers/topics.controllers.js")
const {postCommentByArticleId} = require("./controllers/comments.controllers.js")
const {getArticlesId, getArticles} = require("./controllers/articles.controller.js")

const {getCommentsByArticleId} = require("./controllers/comments.controllers.js")

app.use(express.json());
// app.use(handlePSQLErrors)
// app.use(handleServerErrors)
// app.use(handleCustomErrors)
//tried moving the error handling into a seperate file but ive messed up somewhere so just going to continue and come back to it 
app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticlesId);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

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
