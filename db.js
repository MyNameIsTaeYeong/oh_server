import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DATABASEUSER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.query("SELECT 1", (err, rows, fields) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connect🧡🧡🧡🧡🧡🧡🧡");
  }
});

export default pool.promise();
