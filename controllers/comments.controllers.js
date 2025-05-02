const {selectCommentsByArticleId, addCommentByArticleId} = require("../models/comments.models")
const {selectArticlesById} = require("../models/articles.models")

const getCommentsByArticleId = (req, res, next) => {
 const {article_id} = req.params
 const pendingArticleById = selectArticlesById(article_id)
 const pendingCommentsByFilmId = selectCommentsByArticleId(article_id)
 Promise.all([pendingCommentsByFilmId, pendingArticleById]).then(([comments])=>{
    res.status(200).send({comments})
 }).catch(next)
}

const postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
  
    if (!username || !body) {
      return res.status(400).send({ msg: 'Bad Request' });
    }
  
    const articleIdAsNumber = Number(article_id);
  
    addCommentByArticleId(articleIdAsNumber, username, body)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err); 
      });
  };





module.exports = {getCommentsByArticleId, postCommentByArticleId}