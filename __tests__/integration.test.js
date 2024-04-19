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
describe('/api/articles', () => {
    test('GET: 200, returns an articles array of article objects with a comments count added and body removed', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            articles.forEach((article) => {
                expect(article).toHaveProperty('comment_count')
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
            })
        })      
    })
    test('GET: 200, return an amended articles array of article objects in descending order of date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('created_at', {descending: true})
        }) 
    })
})
describe('/api/articles/:article_id/comments', () => {
    test('GET: 200, returns an array of comment objects asociated with the article ID', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments).toHaveLength(11)
        })
    })
    test('GET: 200, returns an array of comment objects with the most recent comment first', () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('GET: 404, sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/888/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('article does not exist')
        })
    })
    test('GET: 400, sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-an-article/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
 describe('/api/articles/:article_id/comments', () => {
    test('POST: 201, creates a new comment for an article', () => {
        const newComment = {
            body: 'This is a test comment',
            username: 'icellusedkars'
        }
        return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.comment_id).toBe(19)
            expect(response.body.comment.votes).toBe(0)
            expect(response.body.comment.author).toBe('icellusedkars')
            expect(response.body.comment.article_id).toBe(3)
            expect(response.body.comment.body).toBe('This is a test comment')
            expect(typeof response.body.comment.created_at).toBe('string')
        })
    })
    test('POST: 404, sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .post('/api/articles/888/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('POST: 400, sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .post('/api/articles/not-an-article/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('PATCH: 200, returns an updated article by article_id, with amended votes', () => {
        const newVote = {
            inc_votes: 9
        } 
        return request(app)
        .patch('/api/articles/10')
        .send(newVote)
        .expect(200)
        .then(({body}) => {
            const { article } = body;
            expect(article.article_id).toBe(10)
            expect(article.title).toBe('Seven inspirational thought leaders from Manchester UK')
            expect(article.topic).toBe('mitch')
            expect(article.author).toBe('rogersop')
            expect(article.body).toBe('Who are we kidding, there is only one, and it\'s Mitch!')
            expect(typeof article.created_at).toBe('string')
            expect(article.votes).toBe(9)  
            expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        }) 
    }) 
    test('PATCH: 404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .patch ('/api/articles/888')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
        })
    }) 
    test('PATCH: 400, sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .patch('/api/articles/not-an-article')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe('/api/comments/:comment_id', () => {
    test('DELETE: 204, deletes the given comment by comment_id and sends no body back', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    })
    test('DELETE: 404, sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .delete('/api/comments/888')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('comment does not exist')
        })
    })
    test('DELETE: 400, sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/not-an-article')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe('/api/users', () => {
    test('GET:200, responds with an array of user objects with the correct properties', () => {
       return request(app)
       .get('/api/users')
       .expect(200)
       .then(({body}) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
            expect(typeof user.username).toBe('string')
            expect(typeof user.name).toBe('string')
            expect(typeof user.avatar_url).toBe('string')
        })
       })
    });  
 })
 describe('/api/articles', () => {
    test('GET: 200, returns articles of a specified topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
        const { articles } = body
        articles.forEach((article) => {
            expect(article.topic).toBe('mitch')
        })
        })
    })
 })
 