# NC-News-API

Link to hosted version on Render:

https://news-api-project-hnma.onrender.com/api

## Project Summary

This project involves building an API that allows users to access application data programmatically The API mimics a real world backend service (such as Reddit) and provides information to the front end architecture of my NC-News project.

Here are the key components:

 - **Database Setup**: Utilised **PSQL** and **Elephant SQL** to set up the database.
 - **HTTP Endpoints**:  Created endpoints using Express.
 - **Testing**: Followed TDD principles using Jest and Supertest. 
 - **Live Hosting**: The live site is hosted on Render.

Here is the link to my associated front-end project, NC-News:

https://github.com/Wiezien/NC-News 

## Setup Instructions

1. Clone the repository to your local machine:
`git clone https://github.com/Wiezien/News-API-Project.git`

2. Navigate into the cloned folder:
`cd be-nc-news`

3. Install all necessary dependencies:
`npm install`

4. Create the database:
`npm run setup -dbs`

5. Run tests:
`npm test`

6. PSQL tests:
- Open Postgres with `psql`.
- Connect to the test database with `\c nc_news_test`. 
- Enter queries as required.
- Exit PSQL with `\q`.


## Environment Variables

To gain access to the environment variables, please follow these steps:
1. Create a `.env.development` file and add `PGDATABASE=nc_news`.
2. Create a `.env.test` file and add `PGDATABASE=nc_news_test`.
3. Add both files to the `.gitignore` file by typing `.env.*`.


## Minimum Versions Required

- Node.js: 21.6.1
- Postgres: 14.11(Homebrew)
