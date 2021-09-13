import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import "./global.js";
import "./db.js";

dotenv.config();

const app = express();

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () =>
  console.log(`running on port :${process.env.PORT}💚💚💚💚💚💚💚`)
);
