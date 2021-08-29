import express from "express";
import { kakaoLogin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/kakao", kakaoLogin);

export default authRouter;
