const express = require("express");
const { getEmoOccurs } = require("../controllers/emoOccursController");

const emoOccursRouter = express.Router();

emoOccursRouter.get("/:id", getEmoOccurs);

module.exports = emoOccursRouter;
