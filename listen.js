const PORT = process.env.PORT || 9090;
const log = require('./logger.js');
const app = require('./app');

app.listen(PORT, err => {
  if (err) throw err;
  log.info(`Listening on port: ${PORT}`);
});
