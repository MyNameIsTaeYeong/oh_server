const express = require("express");
const { getUsers, postUsers } = require("../controllers/usersController");

const usersRouter = express.Router();

usersRouter.get("/:email", getUsers);
usersRouter.post("/", postUsers);

module.exports = usersRouter;
