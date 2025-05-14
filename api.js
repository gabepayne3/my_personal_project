const db = require("./db/connection.js")
const express = require("express")
const app = express()
// const {handlePSQLErrors, handleServerErrors, handleCustomErrors} = require("./errors.js")
const {getApi, getTopics} = require("./controllers/topics.controllers.js")
const {postCommentByArticleId, getCommentsByArticleId, deleteComment} = require("./controllers/comments.controllers.js")
const {getArticlesId, getArticlesWithCount, patchArticleById} = require("./controllers/articles.controller.js")

const {getUsers} = require("./controllers/users.controllers.js")

app.use(express.json());
// app.use(handlePSQLErrors)
// app.use(handleServerErrors)
// app.use(handleCustomErrors)
//tried moving the error handling into a seperate file but ive messed up somewhere so just going to continue and come back to it 
app.get("/api", getApi)

app.get("/api/users", getUsers)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticlesId);

app.get("/api/articles", getArticlesWithCount)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteComment)

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

// Pirate982Bite6125
// postgresql://postgres:[YOUR-PASSWORD]@db.llbgifkimaobacvtczze.supabase.co:5432/postgres