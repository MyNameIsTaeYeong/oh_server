const dotenv = require("dotenv");

dotenv.config();

const SERVER = `http://172.30.1.38:${process.env.PORT}`;

module.exports = { SERVER };
