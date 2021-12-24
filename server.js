import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import "./global.js";
import "./db.js";
import recordsRouter from "./routers/recordsRouter.js";

dotenv.config();

const app = express();
// json으로 이루어진 request body를 받기 위함.
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/records", recordsRouter);

app.listen(process.env.PORT, () =>
  console.log(`running on port :${process.env.PORT}💚💚💚💚💚💚💚`)
);
