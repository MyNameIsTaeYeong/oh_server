const app = require("./app");
require("./db");
require("./container");
const dotenv = require("dotenv");

dotenv.config();

app.listen(process.env.PORT, () =>
  console.log(`running on port :${process.env.PORT}💚💚💚💚💚💚💚`)
);
