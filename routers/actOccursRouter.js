const express = require("express");
const {
  getActOccurs,
  postActOccurs,
  postActAndEmo,
} = require("../controllers/actOccursController");

const actOccursRouter = express.Router();

actOccursRouter.get("/:id", getActOccurs);
actOccursRouter.post("/:userId/EmoOccurrences", postActAndEmo);
actOccursRouter.post("/", postActOccurs);

module.exports = actOccursRouter;
