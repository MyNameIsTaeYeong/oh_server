const dotenv = require("dotenv");

dotenv.config();

const { MySQL } = require("fxsql");
const { CONNECT } = MySQL;
const POOL = CONNECT({
  host: process.env.HOST,
  user: process.env.DATABASEUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = POOL;
