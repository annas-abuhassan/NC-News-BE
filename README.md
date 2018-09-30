# Northcoders News API

This is my NC News Project.

The aim of this project was to create a RESTful API using express, which is able to serve data from a mongoDB database.

A live version of this app has can be found [here](https://nc-news-aah.herokuapp.com/api)

## Getting Started

### Prerequisites

You will need at least Node v8 point something and Mongo something version.

This project requires the following packages:

- [express](https://www.npmjs.com/package/express)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [mocha](https://www.npmjs.com/package/mocha)
- [chai](https://www.npmjs.com/package/chai)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [supertest](https://www.npmjs.com/package/supertest)

### Steps

1. Clone this repo:

   ```
   git clone https://github.com/annas-abuhassan/BE2-northcoders-news.git
   ```

2. cd into the cloned repo and install all package dependencies:

   ```
   npm install
   ```

3. Run MongoDB:

   ```
   mongod
   ```

4. Before any data can be seeded, you must create a config directory:

   ```
   mkdir config
   touch config/config.js
   ```

5. Paste the following code into your config.js

   ```javascript
   const NODE_ENV = process.env.NODE_ENV || "development";

   const config = {
     test: {
       DB_URL: "mongodb://localhost:27017/nc_news_test"
     },
     development: {
       DB_URL: "mongodb://localhost:27017/nc_news"
     }
   };

   module.exports = config[NODE_ENV];
   ```

6. Seed the development database:

   ```
   npm run seed:dev
   ```

7. Start the express server:

   ```
   npm run dev
   ```

The API is now accessible through port 9090.  
All possible routes for this API can be found at https://localhost:9090/

## Testing

Tests have been created for each endpoint to check for both successful and unsuccessful HTTPs requests.

You are able to test each endpoint locally using:

```
npm run t
```

## Deployment

This app has been deployed to [Heroku](https://dashboard.heroku.com/).  
MongoDB data is currently hosted using [mLabs](https://mlab.com/).

## Authors

Name: Annas Abu-Hassan  
Git: annas-abuhassan
