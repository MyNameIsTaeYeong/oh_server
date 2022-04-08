const express = require("express");
const {
  postShareTags,
  getShareTags,
} = require("../controllers/shareTagsController");

const shareTagsRouter = express.Router();

shareTagsRouter.get("/:id", getShareTags);
shareTagsRouter.post("/", postShareTags);

module.exports = shareTagsRouter;
