const express = require("express");
const { verifyToken } = require("./middlewares");
const activitiesRouter = require("./routers/activitiesRouter");
const actOccursRouter = require("./routers/actOccursRouter");
const emoOccursRouter = require("./routers/emoOccursRouter");
const emotionsRouter = require("./routers/emotionsRouter");
const likesRouter = require("./routers/likesRouter");
const shareTagsRouter = require("./routers/shareTagsRouter");
const usersRouter = require("./routers/usersRouter");

const app = express();

// json으로 이루어진 request body를 받기 위함.
app.use(express.json());

app.use("/users", usersRouter);

app.use(verifyToken);
app.use("/emotions", emotionsRouter);
app.use("/activities", activitiesRouter);
app.use("/emooccurrences", emoOccursRouter);
app.use("/actoccurrences", actOccursRouter);
app.use("/sharetags", shareTagsRouter);
app.use("/likes", likesRouter);

module.exports = app;
