const dotenv = require("dotenv");

dotenv.config();

const SERVER = `http://ec2-52-79-240-19.ap-northeast-2.compute.amazonaws.com:${process.env.PORT}`;

module.exports = { SERVER };
