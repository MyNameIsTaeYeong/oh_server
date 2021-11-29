import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const init = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.HOST,
      user: process.env.DATABASEUSER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      connectionLimit: 10,
    });
    console.log("DB connect🧡🧡🧡🧡🧡🧡🧡");

    return pool.promise();
  } catch (error) {
    console.log(error);
  }
};

export default init();
