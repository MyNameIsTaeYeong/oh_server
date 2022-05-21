const mysql = require("mysql2");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const masterPOOL = mysql
  .createPool({
    host: process.env.MASTER,
    user: process.env.DATABASEUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    connectTimeout: 2000,
    queueLimit: 0,
  })
  .promise();

const slavePOOL = mysql
  .createPool({
    host: process.env.SLAVE,
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
    const conn = await masterPOOL.getConnection();
    return conn;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

const readFromDB = async (query, params) => {
  try {
    const result = (await slavePOOL.execute(query, params))[0];
    return result;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const writeToDB = async (query, params) => {
  try {
    const result = (await masterPOOL.execute(query, params))[0];
    return result;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// const cache = redis.createClient({
//   url: process.env.REDIS,
// });

// cache.on("error", (err) => console.log("Redis Client Error", err));
// cache.on("connect", () => console.log("Redis start connection"));
// cache.on("ready", () => console.log("Redis ready!"));
// cache.on("end", () => console.log("Redis disconnected!"));

// const init = async () => {
//   await cache.connect();
// };

// init();

//module.exports = { cache, masterPOOL, slavePOOL, getConnection };

module.exports = {
  masterPOOL,
  slavePOOL,
  getConnection,
  readFromDB,
  writeToDB,
};
