const express = require("express");
const {
  getEmoOccurs,
  postEmoOccurs,
  postEmoAndAct,
} = require("../controllers/emoOccursController");

const emoOccursRouter = express.Router();

emoOccursRouter.get("/:id", getEmoOccurs);
emoOccursRouter.post("/:userId/ActOccurrences", postEmoAndAct);
emoOccursRouter.post("/", postEmoOccurs);

module.exports = emoOccursRouter;
