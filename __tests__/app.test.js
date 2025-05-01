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

