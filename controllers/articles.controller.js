const endpoints = require("../endpoints.json")
const {selectArticlesById, selectArticles} = require("../models/articles.models")

const getArticlesId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id)
      .then((article) => {
        res.status(200).send({ article: article });
      })
      .catch((err) => {
        next(err);
      });
  };

  const getArticles = (req, res, next) => {
    return selectArticles()
      .then((articles) => {
        res.status(200).send({ articles: articles });
      })
      .catch((err) => {
        next(err);
      });
  };
module.exports = {getArticlesId, getArticles}