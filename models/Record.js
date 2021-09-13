import mongoose from "mongoose";
const { Schema } = mongoose;

const RecordSchema = new Schema({
  name: String,
  dateAndValue: { type: Map, of: Number },
});

const Model = mongoose.model("Record", RecordSchema);

export default Model;
