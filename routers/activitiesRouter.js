const express = require("express");
const { getActivities } = require("../controllers/activitiesController");

const activitiesRouter = express.Router();

activitiesRouter.get("/:id", getActivities);

module.exports = activitiesRouter;
