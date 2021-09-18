import express from "express";
import { logout, updateRecord } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.post("/updateRecord", updateRecord);

export default userRouter;
