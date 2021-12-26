import dotenv from "dotenv";
import pool from "../db.js";
import User from "../models/User.js";
import Record from "../models/Record.js";

dotenv.config();

const insertRecord = async (newUser, userId, recordName) => {
  try {
    const rtn = await pool.execute(
      "INSERT INTO records(userId, recordName) VALUES(?,?)",
      [userId, recordName]
    );
    const recordId = rtn[0].insertId;
    newUser.records.push(new Record(recordId, userId, recordName, []));
    return rtn;
  } catch (error) {
    console.log(error);
  }
};

// export const kakaoLogin = async (req, res) => {
//   try {
//     const getToken = await request({
//       uri: "https://kauth.kakao.com/oauth/token",
//       method: "POST",
//       form: {
//         grant_type: "authorization_code",
//         client_id: process.env.KAKAO_CLIENT_ID,
//         redirect_uri: process.env.KAKAO_REDIRECT_URI,
//         code: req.query.code,
//         client_secret: process.env.KAKAO_CLIENT_SECRET,
//       },
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       json: true,
//     });

//     const response = await request({
//       uri: "https://kapi.kakao.com/v2/user/me",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization: `Bearer ${getToken.access_token}`,
//       },
//       json: true,
//     });

//     // email동의 구하지 않은 경우

//     // email이 없는 경우

//     // email이 유효하지 않은 경우

//     const {
//       kakao_account: { email },
//     } = response;

//     const [rows] = await pool.execute("SELECT id FROM Users WHERE email=?", [
//       email,
//     ]);

//     if (rows[0] === undefined) {
//       let result = await pool.execute("INSERT INTO Users(email) VALUES(?)", [
//         email,
//       ]);
//       const userId = result[0].insertId;

//       const newUser = new User(userId, email, []);

//       const promise1 = insertRecord(newUser, userId, "수면");
//       const promise2 = insertRecord(newUser, userId, "집중력");
//       const promise3 = insertRecord(newUser, userId, "기분");
//       await Promise.all([promise1, promise2, promise3]);
//       console.log(1);
//       console.log(newUser);
//       res.send(newUser);
//     } else {
//       const userId = rows[0].id;
//       const user = new User(userId, email, []);
//       const [recordRows] = await pool.execute(
//         "SELECT * FROM Records WHERE userId=?",
//         [userId]
//       );
//       user.records = recordRows.map((recordRow) => {
//         return new Record(
//           recordRow.id,
//           recordRow.userId,
//           recordRow.recordName,
//           []
//         );
//       });
//       console.log(2);
//       console.log(user);
//       res.send(user);
//     }

//     return res.end();
//   } catch (error) {
//     console.log(error);
//   } finally {
//     res.end();
//   }
// };
