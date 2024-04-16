const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const request = require('supertest')
const expectedContent = require('../endpoints.json')
const { convertTimestampToDate } = require('../db/seeds/utils')


beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    db.end();
});

describe('/api/topics', () => {
    test('GET:200, responds with an array of topic objects with the correct properties', () => {
       return request(app)
       .get('/api/topics')
       .expect(200)
       .then(({body}) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
        })
       })
    });   
})
describe('/api/endpoints', () => {
    test('GET:200, returns the endpoints.json file with all contained information', () => {
       return request(app)
       .get('/api/')
       .expect(200)
       .then(({body}) => {
        expect(body.endpoints).toEqual(expectedContent)
       })
    })
})
describe('/api/articles/:article_id', () => {
    test('GET:200, returns a single article of the specified ID', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
        const { article } = body;
            expect(article.article_id).toBe(1)
            expect(article.title).toBe('Living in the shadow of a great man')
            expect(article.topic).toBe('mitch')
            expect(article.author).toBe('butter_bridge')
            expect(article.body).toBe('I find this existence challenging')
            expect(typeof article.created_at).toBe('string')
            expect(article.votes).toBe(100)
            expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        }) 
    })
    test('GET: 404, sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/888')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-an-article')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
 })
 