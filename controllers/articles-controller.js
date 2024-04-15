const { selectTopics } = require('../models/articles-model')
const endpoints = require('../endpoints.json')

function getTopics(req,res,next){
  selectTopics().then((topics) => {
    res.status(200).send({ topics })
  }) 
}

function getEndpoints(req,res,next){
  res.status(200).send({ endpoints })
}


module.exports = { getTopics, getEndpoints }