const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const POOL = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.DATABASEUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    connectTimeout: 2000,
    queueLimit: 0,
  })
  .promise();

const getConnection = async () => {
  try {
    const conn = await POOL.getConnection();
    return conn;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

module.exports = { POOL, getConnection };
