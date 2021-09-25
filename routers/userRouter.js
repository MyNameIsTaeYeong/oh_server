import express from "express";
import {
  addRecord,
  logout,
  updateRecord,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.post("/updateRecord", updateRecord);
userRouter.post("/addRecord", addRecord);

export default userRouter;
