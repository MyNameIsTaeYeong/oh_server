import pool from "../db.js";
import Record from "../models/Record.js";

export const postRecords = async (req, res) => {
  const { user, recordName } = req.body;
  try {
    const rtn = await pool.execute(
      "INSERT INTO records(userId, recordName) VALUES(?,?)",
      [user._id, recordName]
    );
    const recordId = rtn[0].insertId;
    user.records.push(new Record(recordId, user._id, recordName, []));
    res.send(user);
  } catch (error) {
    console.log(error);
  }

  return res.end();
};
