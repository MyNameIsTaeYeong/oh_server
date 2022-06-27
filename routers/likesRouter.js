const express = require("express");
const { postLikes, deleteLikes } = require("../controllers/likesController");

const likesRouter = express.Router();

likesRouter.post("/", postLikes);
likesRouter.delete("/", deleteLikes);

module.exports = likesRouter;
