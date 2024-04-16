const express = require('express')
const { getTopics, getEndpoints, getArticleById, getArticles } = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(400).send({msg: 'bad request'})
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
    next(err)
})


module.exports = app