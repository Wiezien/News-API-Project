const db = require('../db/connection');
const articles = require('../db/data/test-data/articles');

function selectTopics(){
    return db
    .query('SELECT * FROM topics;')
    .then((result) => {
        return result.rows;
    });
};

function selectArticleById(article_id) {
   return db
   .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
   .then((result) => {
    return result.rows[0]
   })
}

module.exports = { selectTopics, selectArticleById }