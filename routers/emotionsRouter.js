const express = require("express");
const {
  getEmotions,
  postEmotions,
} = require("../controllers/emotionsController");

const emotionsRouter = express.Router();

emotionsRouter.get("/:id", getEmotions);
emotionsRouter.post("/", postEmotions);

module.exports = emotionsRouter;
