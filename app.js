const app = require("express")();
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.set("view_engine", "ejs");

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

app.use((err, req, res, next) => {
  if (
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.name === "Error"
  )
    res.status(400).send({ msg: err.msg || "Bad request" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: err.msg || "Not found" });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
