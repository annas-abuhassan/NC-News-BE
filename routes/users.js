const userRouter = require("express").Router();
const { getUsers, getUserByID } = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/:_id", getUserByID);

module.exports = userRouter;
