const express = require("express");
const userRouter = require("./routers/userRouter");

// import authRouter from "./routers/authRouter.js";
// import recordsRouter from "./routers/recordsRouter.js";

const app = express();

// json으로 이루어진 request body를 받기 위함.
app.use(express.json());

// app.use("/auth", authRouter);
app.use("/users", userRouter);
// app.use("/records", recordsRouter);

module.exports = app;
//export default app;
