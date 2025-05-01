const db = require("../db/connection");

const selectArticlesId = (article_id) => {
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
  

  module.exports = {selectArticlesId}