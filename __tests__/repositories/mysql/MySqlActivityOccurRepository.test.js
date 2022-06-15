const Activity = require("../../../domains/Activity");
const ActOccur = require("../../../domains/ActOccur");
const User = require("../../../domains/User");
const ReadError = require("../../../errors/ReadError");
const UnexpectedError = require("../../../errors/UnexpectedError");
const WriteError = require("../../../errors/WriteError");
const MySqlActivityOccurRepository = require("../../../repositories/mysql/MySqlActivityOccurRepository");
const Container = require("typedi").Container;

afterEach(async () => {
  Container.remove("POOL");
});

describe("MySqlActivityOccurRepository의 save()", () => {
  test("save()는 삽입된 아이디를 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([{ insertId: 1 }]);
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(await mySqlActOccurRepository.save(new ActOccur())).toBe(1);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.save(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 ECONNREFUSED 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.save(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.save(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.save(new ActOccur())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlActivityOccurRepository의 remove()", () => {
  test("remove()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.remove(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 ECONNREFUSED 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.remove(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.remove(new ActOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.remove(new ActOccur())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlActivityOccurRepository의 findByUserId()", () => {
  test("findByUserId()는 유저의 모든 기록을 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([[{}, {}]]);
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);

    const expected = await mySqlActOccurRepository.findByUserId(new User());
    expect(expected.length).toBe(2);
  });

  test("findByUserId()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 ECONNREFUSED 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlActivityOccurRepository의 findByRecordId()", () => {
  test("findByRecordId()는 해당 활동의 기록을 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([[{}, {}]]);
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);

    const expected = await mySqlActOccurRepository.findByRecordId(
      new Activity()
    );

    expect(expected.length).toBe(2);
  });

  test("findByRecordId()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByRecordId(new Activity())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 ECONNREFUSED 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByRecordId(new Activity())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByRecordId(new Activity())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlActOccurRepository = new MySqlActivityOccurRepository(Container);
    expect(
      async () => await mySqlActOccurRepository.findByRecordId(new Activity())
    ).rejects.toThrowError(UnexpectedError);
  });
});
