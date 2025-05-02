const endpoints = require("../endpoints.json")
const {selectArticlesById, selectArticles, updateArticleVotes} = require("../models/articles.models")

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
  const patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes === undefined) {
        return next({ status: 400, msg: 'Bad Request' });
    }
    
    const articleIdAsNumber = Number(article_id)
    updateArticleVotes(articleIdAsNumber, inc_votes)
        .then(updatedArticle => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};
module.exports = {getArticlesId, getArticles, patchArticleById}