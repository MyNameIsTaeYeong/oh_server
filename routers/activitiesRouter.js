const express = require("express");
const {
  getActivities,
  postActivities,
} = require("../controllers/activitiesController");

const activitiesRouter = express.Router();

activitiesRouter.get("/:id", getActivities);
activitiesRouter.post("/", postActivities);

module.exports = activitiesRouter;
