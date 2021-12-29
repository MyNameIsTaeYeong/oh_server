const express = require("express");
const { getEmotions } = require("../controllers/emotionsController");

const emotionsRouter = express.Router();

emotionsRouter.get("/:id", getEmotions);

module.exports = emotionsRouter;
