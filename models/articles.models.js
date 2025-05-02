const db = require("../db/connection");

const selectArticlesById = (article_id) => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
      .then((result) => {
        if (result.rows.length === 0) {
          
          return Promise.reject({ status: 404, msg: "404 Not Found" });
        } else {
          return result.rows[0]; 
        }
      });
  };
  
const selectArticles = () => {
    return db.query(`
    SELECT articles.author, articles.title, articles.article_id,
    articles.topic, articles.created_at, articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url
    ORDER BY articles.created_at DESC;`)
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "404 Not Found" });
        } else {
          return result.rows; 
        }
      })
}

const updateArticleVotes = (article_id, inc_votes) => {
    return db
        .query(
            `UPDATE articles
             SET votes = votes + $1
             WHERE article_id = $2
             RETURNING *;`,
            [inc_votes, article_id]
        )
        .then(result => {
            console.log(result.rows)
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: '404 not found' });
            }
            return result.rows[0];
        });
};
  module.exports = {selectArticlesById, selectArticles, updateArticleVotes}