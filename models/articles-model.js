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

function selectCommentsByArticleId(article_id) {
   return db
   .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
   .then(({rows:comments}) => {
    if(!comments.length){
        return Promise.reject({ status: 404, msg: 'article does not exist' })
      }
    return comments;
   })
}

function insertComment(newComment, article_id) {
    const {username, body} = newComment 
    
    return db
    .query (`INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [body, username, article_id])
    .then((result) => {
        return result.rows[0]
    })
}

function updateVote(newVote, article_id) {
    return db
    .query(`UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *`,
    [newVote, article_id]
    ) 
    .then((result) => {
        // if(!result.rows[0]){
        //     return Promise.reject({ status: 404, msg: 'not found' })
        // }
        return result.rows[0]
    });

}

module.exports = { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, updateVote }