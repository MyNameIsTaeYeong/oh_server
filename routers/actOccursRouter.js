const express = require("express");
const { getActOccurs } = require("../controllers/actOccursController");

const actOccursRouter = express.Router();

actOccursRouter.get("/:id", getActOccurs);

module.exports = actOccursRouter;
