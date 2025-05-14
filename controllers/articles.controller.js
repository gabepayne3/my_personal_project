const endpoints = require("../endpoints.json")
const {selectArticlesById, selectArticlesWithCount, updateArticleVotes} = require("../models/articles.models")

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

  const getArticlesWithCount = (req, res, next) => {
    const { sort_by, order } = req.query;
    console.log(sort_by)
    let sortFinal
    let orderFinal
    if(sort_by === undefined){
      sortFinal = 'created_at'
    }else (sortFinal = sort_by)
    if(order === undefined){
      orderFinal = 'DESC'
    }
    return selectArticlesWithCount(sortFinal, orderFinal)
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

// const getArticlesSorted = (req, res, next) => {
//   const { sort_by, order } = req.query;

//   selectArticlesSorted(sort_by, order)
//     .then((articles) => {
//       res.status(200).send({ articles });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };



module.exports = {getArticlesId, getArticlesWithCount, patchArticleById}