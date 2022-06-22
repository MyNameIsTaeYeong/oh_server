const mysql = require("mysql2");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const POOL = mysql
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

const getConnection = async () => {
  try {
    const conn = await POOL.getConnection();
    return conn;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

const cache = redis.createClient({
  url: process.env.REDIS,
});

cache.on("error", (err) => console.log("Redis Client Error", err));
cache.on("connect", () => console.log("Redis start connection"));
cache.on("ready", () => console.log("Redis ready!"));
//cache.on("end", () => console.log("Redis disconnected!"));

const init = async () => {
  await cache.connect();
};

init();

module.exports = {
  cache,
  POOL,
  getConnection,
};
