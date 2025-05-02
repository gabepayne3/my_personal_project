const db = require("../db/connection");

const selectUsers = () => {
    return db
      .query(
        `SELECT users.username, users.name, users.avatar_url FROM users`
      )
      .then((result) => {
        return result.rows;
      });
  };

  module.exports = {selectUsers}