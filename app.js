const app = require("express")();
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.set("view_engine", "ejs");
const { handle400, handle404, handle500 } = require("./utils");

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("connected to the database!");
  })
  .catch();

app.get("/", (req, res, next) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
