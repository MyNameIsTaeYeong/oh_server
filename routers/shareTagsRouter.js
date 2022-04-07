const express = require("express");
const { postShareTags } = require("../controllers/shareTagsController");

const shareTagsRouter = express.Router();

shareTagsRouter.post("/", postShareTags);

module.exports = shareTagsRouter;
