const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId } = require('../models/articles-model')
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
    next(err)
  })
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params
  selectCommentsByArticleId(article_id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch((err) => {
    next(err)
  })
}


module.exports = { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId }