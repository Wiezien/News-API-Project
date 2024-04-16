const { selectTopics, selectArticleById, selectArticles } = require('../models/articles-model')
const endpoints = require('../endpoints.json')

function getTopics(req, res, next){
  selectTopics().then((topics) => {
    res.status(200).send({ topics })
  }) 
}

function getEndpoints(req,res,next){
  res.status(200).send({ endpoints })
}

function getArticleById(req, res, next){
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
      if(!article){
        res.status(404).send({ msg: 'article does not exist' })
      }
      else {
        res.status(200).send({ article })
      }
    }).catch((err) => {
      next(err)
    })
}

function getArticles(req, res , next) {
  selectArticles().then((articles) => {
    res.status(200).send({ articles })
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })
}


module.exports = { getTopics, getEndpoints, getArticleById, getArticles }