import express from "express";
import {
  addRecord,
  calculateRecord,
  logout,
  updateRecord,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.post("/updateRecord", updateRecord);
userRouter.post("/addRecord", addRecord);
userRouter.post("/calculateRecord", calculateRecord);

export default userRouter;
