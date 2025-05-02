const {selectCommentsByArticleId} = require("../models/comments.models")
const {selectArticlesById} = require("../models/articles.models")

const getCommentsByArticleId = (req, res, next) => {
 const {article_id} = req.params
 const pendingArticleById = selectArticlesById(article_id)
 const pendingCommentsByFilmId = selectCommentsByArticleId(article_id)
 Promise.all([pendingCommentsByFilmId, pendingArticleById]).then(([comments])=>{
    res.status(200).send({comments})
 }).catch(next)
}







module.exports = {getCommentsByArticleId}