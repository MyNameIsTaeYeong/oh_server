const express = require("express");
const {
  getActOccurs,
  postActOccurs,
} = require("../controllers/actOccursController");

const actOccursRouter = express.Router();

actOccursRouter.get("/:id", getActOccurs);
actOccursRouter.post("/", postActOccurs);

module.exports = actOccursRouter;
