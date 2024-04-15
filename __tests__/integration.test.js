const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const request = require('supertest')

beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    db.end();
});

describe('/api/topics', () => {
    test('GET: 200, responds with an array of topic objects with the correct properties', () => {
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