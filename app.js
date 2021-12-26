import express from "express";
// import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
// import recordsRouter from "./routers/recordsRouter.js";

const app = express();

// json으로 이루어진 request body를 받기 위함.
app.use(express.json());

// app.use("/auth", authRouter);
app.use("/users", userRouter);
// app.use("/records", recordsRouter);

module.exports = app;
//export default app;
