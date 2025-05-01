const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const request  = require("supertest");
const seed = require('../db/seeds/seed');
const app = require("../api.js");
const data = require('../db/data/test-data/index');

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(()=>{
  return seed(data)
})

afterAll(()=>{
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(endpointsJson);
      });
  });
});
describe("GET /api-topics",() =>{
test("200: responds with an an array of topic objects", ()=>{
  return request(app)
  .get("/api/topics")
  .expect(200).then((response) =>{
    const topic = response.body.topics
    topic.forEach((topic)=>{
      expect(topic).toEqual(expect.objectContaining(
        {
          slug: expect.any(String),
          description: expect.any(String)
        }
      ))
    })
  })
})

})
describe("GET /api-articles/:article_id",()=>{
  test("200 : responds with a single object in article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(1);
      });
  });
  test("400 : responds with error of bad request/ invalid id", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("404 : responds with error of valid route/ but non existent article", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 Not Found");
      });
  });
})
describe("GET /api/articles with comment_count key and value",()=>{
  test("200: responds with array of article objects, each of which should have articles properties and comment count added",()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response)=> { 
      console.log(`<<<<<<<<<<<${response}`)
      const articles = response.body.articles;
      console.log(articles)
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        

        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
        );
      });
    })
  })
  test("200: sort by dates",()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response)=>{
      const article = response.body.articles
      expect(article).toBeSortedBy("created_at", {descending: true})
    })
  })
  test('200: articles with no comments still include comment_count as 0', () => {
    return db.query('DELETE FROM comments;')
      .then(() => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            res.body.articles.forEach((article) => {
              expect(article.comment_count).toBe(0);
            });
          });
      });
  })
  
})

