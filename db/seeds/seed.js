const db = require("../connection");
const format = require('pg-format');
const {convertTimestampToDate, referenceObject} = require('./utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS articles`);
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users`);
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS topics`);
  })
  .then(()=>{
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR, 
      img_url VARCHAR(1000) NOT NULL
      )`);
  })
  .then(()=>{
    return db.query(`CREATE TABLE users (
      username VARCHAR PRIMARY KEY, 
      name VARCHAR, 
      avatar_url VARCHAR(1000) NOT NULL
      )`);
  })
  .then(()=>{
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY, 
      title VARCHAR,
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username), 
      body TEXT, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, 
      article_img_url VARCHAR(1000)
      )`);
  })
  .then(()=>{
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY, 
      article_id INT REFERENCES articles(article_id), body TEXT, 
      votes INT DEFAULT 0, 
      author VARCHAR REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
  })
  .then(()=>{
    const formattedTopics = topicData.map((topic)=>{
      return [topic.slug, topic.description, topic.img_url];
    });
    const insertIntoTopicsQuery = format(
      `INSERT INTO topics (slug, description, img_url)
      VALUES %L`,
      formattedTopics
    );
    return db.query(insertIntoTopicsQuery);
  })
  .then(()=>{
    const formattedUsers = userData.map((user)=>{
      return [user.username, user.name, user.avatar_url];
    });
    const insertIntoUsersQuery = format(
      `INSERT INTO users (username, name, avatar_url)
      VALUES %L`,
      formattedUsers
    );
    return db.query(insertIntoUsersQuery);
  })
  .then(()=>{
    const formattedArticles = articleData.map((article)=>{
      const convArticleStamp = convertTimestampToDate(article);
      return [
        convArticleStamp.title,
        convArticleStamp.topic,
        convArticleStamp.author,
        convArticleStamp.body,
        convArticleStamp.created_at,
        convArticleStamp.votes,
        convArticleStamp.article_img_url,
      ];
    });
    const InsertIntoArticlesQuery = format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
      formattedArticles
    );
    return db.query(InsertIntoArticlesQuery);
  })
 .then((result)=>{
   const articlesRefObj = referenceObject(result.rows)
   const formattedComments = commentData.map((comment)=>{
    const convCommentsStamp = convertTimestampToDate(comment)
      return [
        articlesRefObj[comment.article_title],
        convCommentsStamp.body,
        convCommentsStamp.votes,
        convCommentsStamp.author,
        convCommentsStamp.created_at,
      ]
   })
   
   const insertIntoCommentsQuery = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
    formattedComments
   )
   return db.query(insertIntoCommentsQuery)
 })
};
module.exports = seed;
