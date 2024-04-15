const express = require('express')
const { getTopics, getEndpoints } = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/', getEndpoints)

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