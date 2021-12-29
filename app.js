const express = require("express");
const emotionsRouter = require("./routers/emotionsRouter");
const usersRouter = require("./routers/usersRouter");

const app = express();

// json으로 이루어진 request body를 받기 위함.
app.use(express.json());

app.use("/users", usersRouter);
app.use("/emotions", emotionsRouter);

module.exports = app;
