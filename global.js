const dotenv = require("dotenv");

dotenv.config();

const SERVER = `http://172.16.100.46:${process.env.PORT}`;

module.exports = { SERVER };
