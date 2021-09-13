import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  records: [
    {
      type: Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
});

const Model = mongoose.model("User", UserSchema);

export default Model;
