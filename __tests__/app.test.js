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
  test("200 : responds with a single object in treasure", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.article_id).toBe(1);
      });
  });
  test("400 : responds with error of bad request/ non-exist id", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("404 : responds with error of invalid route/ out of the range", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 Not Found");
      });
  });
})

