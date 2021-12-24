import express from "express";
import { postRecords } from "../controllers/recordsController.js";

const recordsRouter = express.Router();

recordsRouter.post("/", postRecords);

export default recordsRouter;
