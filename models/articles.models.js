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
  
const selectArticlesWithCount = (sort_by, order) => {
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
    ORDER BY articles.${sort_by} ${order};`)
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

            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: '404 not found' });
            }
            return result.rows[0];
        });
};

const validSortColumns = ['title', 'author', 'topic', 'created_at', 'votes', 'article_id'];
const validOrders = ['asc', 'desc'];


// const selectArticlesSorted = (sort_by = 'created_at', order = 'desc') => {
//   if (!validSortColumns.includes(sort_by)) {
//     return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
//   }

//   const orderLower = order.toLowerCase();
//   if (!validOrders.includes(orderLower)) {
//     return Promise.reject({ status: 400, msg: 'Invalid order query' });
//   }

//   const queryStr = `
//     SELECT article_id, title, topic, author, created_at, votes
//     FROM articles
//     ORDER BY ${sort_by} ${orderLower.toUpperCase()}
//   `;

//   return db.query(queryStr).then((result) => {
//     return result.rows;
//   });
// };


// const selectArticlesSorted = (sort_by = 'created_at', order = 'desc') => {
//   if (!validSortColumns.includes(sort_by)) {
//     return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
//   }

//   if (!validOrders.includes(order.toLowerCase())) {
//     return Promise.reject({ status: 400, msg: 'Invalid order query' });
//   }

//   const queryStr = `
//     SELECT article_id, title, topic, author, created_at, votes
//     FROM articles
//     ORDER BY ${sort_by} ${order.toUpperCase()}
//   `;

//   return db.query(queryStr).then((result) => {
//     return result.rows;
//   });
// };

  module.exports = {selectArticlesById, selectArticlesWithCount, updateArticleVotes}