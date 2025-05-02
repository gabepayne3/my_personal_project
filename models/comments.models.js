const db = require("../db/connection");


const selectCommentsByArticleId = (article_id)=>{
    return db
    .query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
          
            return [];
          } else {
            return result.rows; 
          }
    })
} 

const addCommentByArticleId = (article_id, username, body) => {
   return db
      .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then((articleResult) => {
        if (articleResult.rows.length === 0) {
          return Promise.reject({ status: 404, msg: '404 not found' });
        }
        return db.query('SELECT * FROM users WHERE username = $1', [username]);
      })
      .then((userResult) => {
        if (userResult.rows.length === 0) {
          return Promise.reject({ status: 404, msg: '404 not found' });
        }
        return db.query(
          `INSERT INTO comments (article_id, author, body)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [article_id, username, body]
        );
      })
      .then((result) => {
        return result.rows[0];
      });
  };









module.exports = {selectCommentsByArticleId, addCommentByArticleId}
