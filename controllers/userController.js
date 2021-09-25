import User from "../models/User.js";
import Record from "../models/Record.js";

export const logout = async (req, res) => {
  try {
    res.send({ done: true });
  } catch (error) {
    console.log(error);
  }
};

export const addRecord = async (req, res) => {
  const { userId, recordName } = req.body;
  try {
    const user = await User.findById(userId).populate("records");
    const record = await Record.create({
      name: recordName,
      dateAndValue: new Map(),
    });

    user.records.push(record);
    user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateRecord = async (req, res) => {
  const { userId, currentDate, recordId, recordIndex, recordValue } = req.body;
  const value = parseInt(recordValue);
  try {
    const user = await User.findById(userId).populate("records");
    const record = await Record.findById(recordId);
    record.dateAndValue.set(currentDate, value);
    user.records[recordIndex] = record;
    record.save();
    user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};
