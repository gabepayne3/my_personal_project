const db = require("../db/connection");

const selectTopics = () => {
  return db
    .query(
      `SELECT topics.slug, topics.description FROM topics`
    )
    .then((result) => {
      return result.rows;
    });
};

module.exports = {selectTopics}