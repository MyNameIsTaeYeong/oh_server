import request from "request-promise";
import global from "../global.js";
import dotenv from "dotenv";
import User from "../models/User.js";
import Record from "../models/Record.js";

dotenv.config();

export const kakaoLogin = async (req, res) => {
  try {
    const getToken = await request({
      uri: "https://kauth.kakao.com/oauth/token",
      method: "POST",
      form: {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code: req.query.code,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    });

    global.token = getToken.access_token;

    const response = await request({
      uri: "https://kapi.kakao.com/v2/user/me",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getToken.access_token}`,
      },
      json: true,
    });

    // email동의 구하지 않은 경우

    // email이 없는 경우

    // email이 유효하지 않은 경우

    const {
      kakao_account: { email },
    } = response;

    const user = await User.findOne({ email }).populate("records");
    if (user) {
      res.send(user);
      console.log("haha");
    } else {
      console.log("hoho");
      const record1 = await Record.create({
        name: "수면",
        dateAndValue: new Map(),
      });

      const record2 = await Record.create({
        name: "집중력",
        dateAndValue: new Map(),
      });

      const record3 = await Record.create({
        name: "기분",
        dateAndValue: new Map(),
      });

      const records = [];
      records.push(record1);
      records.push(record2);
      records.push(record3);
      const newUser = await User.create({ email, records });
      res.send(newUser);
    }
  } catch (error) {
    console.log(error);
  } finally {
    res.end();
  }
};
