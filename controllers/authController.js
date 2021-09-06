import request from "request-promise";
import global from "../global.js";
import dotenv from "dotenv";

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
    console.log(email);
    res.send({ email, name: "탱탱" });
  } catch (error) {
    console.log(error);
  } finally {
    res.end();
  }
};
