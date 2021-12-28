const express = require("express");
const { getUsers } = require("../controllers/userController");
// import {
//   addRecord,
//   calculateRecord,
//   getUsers,
//   logout,
//   updateRecord,
// } from "../controllers/userController.js";

const userRouter = express.Router();

// userRouter.get("/logout", logout);
// userRouter.post("/updateRecord", updateRecord);
// userRouter.post("/addRecord", addRecord);
// userRouter.post("/calculateRecord", calculateRecord);
userRouter.get("/:id", getUsers);
module.exports = userRouter;
