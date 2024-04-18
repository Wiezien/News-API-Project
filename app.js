const express = require('express')
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticles } = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticles)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(400).send({msg: 'bad request'})
    next(err)
})

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'not found'})
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
    next(err)
})


module.exports = app