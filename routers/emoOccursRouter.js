const express = require("express");
const {
  getEmoOccurs,
  postEmoOccurs,
} = require("../controllers/emoOccursController");

const emoOccursRouter = express.Router();

emoOccursRouter.get("/:id", getEmoOccurs);
emoOccursRouter.post("/", postEmoOccurs);

module.exports = emoOccursRouter;
