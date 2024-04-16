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
    //console.log(result)
    return result.rows[0]
   })
}

function selectArticles(articles, comments){
    return db
    .query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id 
    GROUP BY
    articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then((result) => {
        return result.rows;
    })
}

module.exports = { selectTopics, selectArticleById, selectArticles }