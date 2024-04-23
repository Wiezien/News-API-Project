Link to hosted version on Render:
https://news-api-project-hnma.onrender.com

Project Summary:
Built an API to access application data programmatically, mimicking a real world backend service(such as Reddit)  providing information to the front end architecture. PSQL and Elephant SQL were utilised to set up the database and Express to create the HTTP endpoints. TDD principles were followed using Jest and Supertest. Render hosts the live site.

SET UP INSTRUCTIONS

To clone repository to your local machine:
`git clone https://github.com/Wiezien/News-API-Project.git`

Navigate into the cloned folder:
`cd be-nc-news`

Install all necessary dependencies:
`npm install`

Create database:
`npm run setup -dbs`

Run tests:
`npm test`

PSQL tests:
`psql` (to open postgres)
`\c nc_news_test` (to connect to test database)
enter queries as required
`\q` (to exit PSQL)

To gain access to the environment variables please follow these steps:
1) create a .env.development file
2) add in the file PGDATABASE=nc_news
3) create a .env.test file
4) add in the file PGDATABASE=nc_news_test
5) add both files to the gitignore file by typing .env.*

Minimum versions required to run project:
Node.js 21.6.1
Postgres 14.11(Homebrew)
