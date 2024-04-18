const express = require('express')
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticles, deleteCommentById } = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticles)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    if(err.code === "23502"){
        res.status(404).send({msg: 'not found'})
    } else {
        next(err)
    }
})
    
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
       next(err)
    } 
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
    next(err)
})


module.exports = app