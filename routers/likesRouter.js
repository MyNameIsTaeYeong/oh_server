const express = require("express");
const { postLikes } = require("../controllers/likesController");

const likesRouter = express.Router();

likesRouter.post("/", postLikes);

module.exports = likesRouter;
