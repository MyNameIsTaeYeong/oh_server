const User = require("../models/User");
const Record = require("../models/Record");
const { selectUsers } = require("./queries");

const logout = async (req, res) => {
  try {
    res.send({ done: true });
  } catch (error) {
    console.log(error);
  }
};

const addRecord = async (req, res) => {
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

const updateRecord = async (req, res) => {
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

//통계 로직
// 1. 해당 기록이 발생한 날짜와 값을 가져온다.
// 2. 1번기록이 발생한 날의 모든 기록을 1번 날짜의 값에 저장.
const calculateRecord = async (req, res) => {
  const { index, userId } = req.body;
  try {
    const user = await User.findById(userId).populate("records");
    const records = user.records;

    const record = records[index];
    records.splice(index, 1);

    const whenGood = records.map((record) => {
      return {
        name: record.name,
        good: 0,
        bad: 0,
      };
    });

    const whenBad = records.map((record) => {
      return {
        name: record.name,
        good: 0,
        bad: 0,
      };
    });

    let goodFeq = 0;
    let badFeq = 0;

    for (const [date, value] of record.dateAndValue) {
      let obj;
      if (value === 1) {
        obj = whenGood;
        goodFeq++;
      } else {
        obj = whenBad;
        badFeq++;
      }

      records.forEach((element, index) => {
        const state = element.dateAndValue.get(date);
        if (state !== undefined) {
          if (state === 1) {
            obj[index].good++;
          } else {
            obj[index].bad++;
          }
        }
      });
    }

    res.send({ whenGood, whenBad, goodFeq, badFeq });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const data = { id: req.params.id };
    const results = await selectUsers(data);
    if (results === 500) {
      throw Error("DB 에러");
    }
    res.status(200).json(results[0].email);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { logout, addRecord, updateRecord, calculateRecord, getUsers };
