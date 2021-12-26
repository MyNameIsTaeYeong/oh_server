import app from "./app.js";
import "./db.js";

import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () =>
  console.log(`running on port :${process.env.PORT}💚💚💚💚💚💚💚`)
);
