const express = require("express");
const {
  getActivities,
  postActivities,
  deleteActivities,
} = require("../controllers/activitiesController");

const activitiesRouter = express.Router();

activitiesRouter.delete("/:id", deleteActivities);
activitiesRouter.get("/:id", getActivities);
activitiesRouter.post("/", postActivities);

module.exports = activitiesRouter;
