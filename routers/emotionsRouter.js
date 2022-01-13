const express = require("express");
const {
  getEmotions,
  postEmotions,
  deleteEmotions,
} = require("../controllers/emotionsController");

const emotionsRouter = express.Router();

emotionsRouter.delete("/:id", deleteEmotions);
emotionsRouter.get("/:id", getEmotions);
emotionsRouter.post("/", postEmotions);

module.exports = emotionsRouter;
