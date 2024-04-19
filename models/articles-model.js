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

function selectArticles(articles, comments, topic){
    const queryValues = []
    let sqlQuery = 'SELECT * FROM articles';

    if (topic){
        queryValues.push(topic)
        sqlQuery += `COUNT(comments.article_id) AS comment_count
             FROM articles
             LEFT JOIN comments
             ON articles.article_id = comments.article_id 
             WHERE TOPIC = $1
             GROUP BY
             articles.article_id
             ORDER BY articles.created_at DESC;`,
             [topic]
        return queryValues
    }
    else {
        sqlQuery += (`COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id 
        GROUP BY
        articles.article_id
        ORDER BY articles.created_at DESC;`,
        [topic])
    return db
    .query('SELECT * FROM articles WHERE topic = $1', [topic])
    .then((result) => {
        return result.rows;
    })
    }
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
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article does not exist'})
        }
    return rows[0]
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
        if(!result.rows[0]){
            return Promise.reject({ status: 404, msg: 'not found' })
        }
        return result.rows[0]
    });
}

function removeCommentById(comment_id){
    return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'comment does not exist'})
        }
    });
}

function selectUsers(){
    return db
    .query('SELECT * FROM users')
    .then((result) => {
        return result.rows;
    })
}

module.exports = { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, updateVote, removeCommentById, selectUsers }