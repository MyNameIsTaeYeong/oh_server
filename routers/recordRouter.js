import express from "express";
import { postRecords } from "../controllers/recordController.js";

const recordRouter = express.Router();

recordRouter.post("/", postRecords);

export default recordRouter;
