const cors = require('cors');
const { log } = require('./logger.js');
const app = require('express')();
const apiRouter = require('./routes/api');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { handle400, handle404, handle500 } = require('./utils');
const { DB_URL } =
  process.env.NODE_ENV === 'production' ? process.env : require('./config');
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    log.debug('connected to the database');
  })
  .catch();

app.get('/', (req, res, next) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404 });
});

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
