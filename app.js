const express = require('express')
const { getTopics } = require('./controllers/articles-controller')

const app = express();

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
})


module.exports = app