import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const uri = `mongodb+srv://client:${process.env.PASSWORD}@oh.7atzu.mongodb.net/oh?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB connect! 💚💚💚💚💚");
});
