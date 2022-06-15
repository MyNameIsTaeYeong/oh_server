const Activity = require("../../../domains/Activity");
const User = require("../../../domains/User");
const ReadError = require("../../../errors/ReadError");
const UnexpectedError = require("../../../errors/UnexpectedError");
const WriteError = require("../../../errors/WriteError");
const MySqlActivityRepository = require("../../../repositories/mysql/MySqlActivityRepository");

const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("POOL");
});

describe("MySqlActivityRepository의 save()", () => {
  test("save()는 저장된 활동 아이디를 반환해야 한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([{ insertId: 1 }]);
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(await mySqlActivityRepository.save(new Activity())).toBe(1);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.save(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.save(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.save(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.save(new Activity())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlActivityRepository의 remove()", () => {
  test("remove()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.remove(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.remove(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.remove(new Activity())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(async () =>
      mySqlActivityRepository.remove(new Activity())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlActivityRepository의 findAll()", () => {
  test("findAll()는 저장된 활동 아이디를 반환해야 한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([[{}, {}]]);
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect((await mySqlActivityRepository.findAll(new User())).length).toBe(2);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(
      async () => await mySqlActivityRepository.findAll(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("save()는 ECONNREFUSED 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(
      async () => await mySqlActivityRepository.findAll(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(
      async () => await mySqlActivityRepository.findAll(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("save()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlActivityRepository = new MySqlActivityRepository(Container);
    expect(
      async () => await mySqlActivityRepository.findAll(new User())
    ).rejects.toThrowError(UnexpectedError);
  });
});
