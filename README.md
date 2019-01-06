# Northcoders News API

The aim of this project was to build a RESTful API using both express and mongoDB.  
As of 06/01/2019, this project now integrates third party logging for all API calls with AWS CloudWatch.

A live version of this app has can be found [here](https://nc-news-aah.herokuapp.com)

## Getting Started

### Prerequisites

You will need at least Node 8.12.0 and MongoDB 4.0.

This project requires the following packages:

- [express](https://www.npmjs.com/package/express)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [mocha](https://www.npmjs.com/package/mocha)
- [chai](https://www.npmjs.com/package/chai)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [supertest](https://www.npmjs.com/package/supertest)
- [winston](https://www.npmjs.com/package/winston)
- [winston-aws-cloudwatch](https://www.npmjs.com/package/winston-aws-cloudwatch)

### Steps

1. Clone this repo:

   ```
   git clone https://github.com/annas-abuhassan/BE2-northcoders-news.git
   ```

2. cd into the cloned repo and install all package dependencies:

   ```
   npm install
   ```

3. Run MongoDB in a separate terminal:

   ```
   mongod
   ```

4. Before any data can be seeded, you must create a config directory:

   ```
   mkdir config
   touch config/index.js
   ```

5. Add the following code into your index.js. If you want to make use of AWS CloudWatch logging, include your secret information

   ```javascript
   const NODE_ENV = process.env.NODE_ENV || 'development';

   const config = {
     test: {
       DB_URL: 'mongodb://localhost:27017/nc_news_test'
     },
     development: {
       DB_URL: 'mongodb://localhost:27017/nc_news'
     }
   };

   module.exports = config[NODE_ENV];
   ```

6. Seed the development database:

   ```
   npm run seed:dev
   ```

7. Configure your log settings in your config/index.js file, replace all the AWS values with ones from your own CloudWatch service:

   ```javascript
   const NODE_ENV = process.env.NODE_ENV || 'development';

   const config = {
     test: {
       DB_URL: 'mongodb://localhost:27017/nc_news_test',
       password: `THIS IS THE PASSWORD USED TO CHANGE THE LOGGING LEVEL, SET THIS TO WHATEVER YOU WISH`
     },
     development: {
       DB_URL: 'mongodb://localhost:27017/nc_news',
       accessKeyId: 'AWS CLOUDWATCH ACCESS KEY ID',
       secretAccessKey: 'AWS CLOUDWATCH SECRET ACCESS KEY',
       region: 'AWS CLOUDWATCH REGION',
       logGroupName: 'AWS LOG GROUP NAME',
       logStreamName: 'AWS LOG STREAM NAME',
       password: `THIS IS THE PASSWORD USED TO CHANGE THE LOGGING LEVEL, SET THIS TO WHATEVER YOU WISH`
     }
   };

   module.exports = config[NODE_ENV];
   ```

8. Start the express server:

   ```
   npm run dev
   ```

The API is now accessible through port 9090.  
Documentation for this API has been made with Postman and can be found [here.](https://documenter.getpostman.com/view/5314514/RznEJxtF)

## Testing

Tests have been created for each endpoint to check for both successful and unsuccessful HTTPs requests.

You are able to test each endpoint locally using:

```
npm t
```

## Deployment

This app has been deployed to [Heroku](https://dashboard.heroku.com/).  
MongoDB data is currently hosted using [mLabs](https://mlab.com/).  
Logging integration made possible through [AWS Cloudwatch.](https://aws.amazon.com/cloudwatch/)

## Authors

Name: Annas Abu-Hassan  
Git: annas-abuhassan
