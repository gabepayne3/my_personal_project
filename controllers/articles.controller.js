const endpoints = require("../endpoints.json")
const {selectArticlesId} = require("../models/articles.models")

const getArticlesId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesId(article_id)
      .then((articles) => {
        res.status(200).send({ articles: articles });
      })
      .catch((err) => {
        next(err);
      });
  };
module.exports = {getArticlesId}