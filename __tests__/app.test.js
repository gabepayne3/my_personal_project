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

      const articles = response.body.articles;

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
describe("GET /api/articles/:article_id/comments", ()=>{
  test("200: responds with an array of comments for the given article_id ",()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}})=>{

      expect(comments.length).toBe(11)
      comments.forEach((comment)=>{

        expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
        })
      })
    })
    
 })
 test('200: responds with an empty array if article exists but has no comments', () => {
  return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then(({body: {comments}}) => {

      expect(comments).toEqual([]);
    });
});

test('400: responds with bad request if article_id is invalid', () => {
  return request(app)
    .get('/api/articles/not-a-number/comments')
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Bad Request');
    });
});

test('404: responds with not found if article does not exist', () => {
  return request(app)
    .get('/api/articles/9999/comments') 
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('404 Not Found');
    });
});
})
describe('POST /api/articles/:article_id/comments', () => {
  test('201: posts a comment and returns it', () => {
    const newComment = {
      username: 'rogersop',
      body: 'you"re a wizard harry!'
    };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        
        expect(response.body.comment).toMatchObject({
          article_id: 1,
          author: 'rogersop',
          body: 'you"re a wizard harry!',
          votes: expect.any(Number),
          comment_id: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  });

  test('400: missing username/body', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'rogersop' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request');
      });
  });

  test('404: responds with not found if article does not exist', () => {
    return request(app)
      .post('/api/articles/1738/comments')
      .send({ 
        username: 'rogersop', 
        body: 'you"re a wizard harry!' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('404 not found');
      });
  });

  test('404: non-existent user', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ 
        username: 'CL4P-TP', 
        body: 'Not Stairssss!!!!' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('404 not found');
      });
  });

  test('400: invalid article_id', () => {
    return request(app)
      .post('/api/articles/not-a-number/comments')
      .send({ 
        username: 'rogersop', 
        body: 'you"re a wizard harry' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request');
      });
  });
});
describe('PATCH /api/articles/:article_id', () => {
  test('200: responds with the updated article when passed a valid inc_votes', () => {
      return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then((response) => {
              expect(response.body.article).toHaveProperty('votes', 101);
          });
  });
  test('400: responds with error for invalid inc_votes type', () => {
      return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'treacle converse' })
          .expect(400)
          .then((res) => {
              expect(res.body.msg).toBe('Bad Request');
          });
  });
  test('400: responds with error when inc_votes is missing', () => {
      return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then((response) => {
              expect(response.body.msg).toBe('Bad Request');
          });
  });
  test('404: responds with error for non-existent article', () => {
      return request(app)
          .patch('/api/articles/9999')
          .send({ inc_votes: 10 })
          .expect(404)
          .then((response) => {
              expect(response.body.msg).toBe('404 not found');
          });
  });
  test('400: responds with error for invalid article_id', () => {
      return request(app)
          .patch('/api/articles/not-a-number')
          .send({ inc_votes: 5 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          })
  });
});
describe('DELETE /api/comments/:comment_id', () => {
  test('204: deletes the comment and responds with no content', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then((res) => {

        expect(res.body).toEqual({});
      });
  });

  test('404: responds with not found for non-existent comment_id', () => {
    return request(app)
      .delete('/api/comments/009766')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('404 not found');
      });
  });

  test('400: responds with bad request for invalid comment_id', () => {
    return request(app)
      .delete('/api/comments/abc')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request');
      });
  });
});

describe('GET /api/users', () => {
  it('responds with status 200 and an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        const users = res.body.users
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
})