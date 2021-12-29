const express = require("express");
const { getUsers } = require("../controllers/usersController");

const usersRouter = express.Router();

usersRouter.get("/:id", getUsers);

module.exports = usersRouter;
