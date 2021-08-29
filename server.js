import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";

dotenv.config();

const app = express();

app.use("/auth", authRouter);

app.listen(process.env.PORT, () =>
  console.log(`running on port :${process.env.PORT}💚💚💚💚💚💚💚`)
);
