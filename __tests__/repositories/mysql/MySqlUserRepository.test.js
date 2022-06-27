const User = require("../../../domains/User");
const ReadError = require("../../../errors/ReadError");
const UnexpectedError = require("../../../errors/UnexpectedError");
const WriteError = require("../../../errors/WriteError");
const MySqlUserRepository = require("../../../repositories/mysql/MySqlUserRepository");

const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("POOL");
});

describe("MySqlUserRepository의 save()", () => {
  test("save()는 유저아이디를 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([{ insertId: 1 }]);
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);

    expect(await mySqlUserRepository.save(new User({}))).toBe(1);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.save(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.save(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.save(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.save(new User({}))
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlUserRepository의 remove()", () => {
  test("remove()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.remove(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.remove(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.remove(new User({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(async () =>
      mySqlUserRepository.remove(new User({}))
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlUserRepository의 findAll()", () => {
  test("findAll()는 저장된 활동 아이디를 반환해야 한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([[{}, {}]]);
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect((await mySqlUserRepository.findAll()).length).toBe(2);
  });

  test("findAll()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findAll()
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()는 ECONNREFUSED 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findAll()
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findAll()
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findAll()
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlUserRepository의 findByEmail", () => {
  test("findByEmail()은 유저객체를 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([[{ email: "jaja" }]]);
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      (await mySqlUserRepository.findByEmail(new User({}))).email
    ).toStrictEqual("jaja");
  });

  test("findByEmail()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findByEmail(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByEmail()는 ECONNREFUSED 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findByEmail(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByEmail()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findByEmail(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByEmail()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlUserRepository = new MySqlUserRepository(Container);
    expect(
      async () => await mySqlUserRepository.findByEmail(new User({}))
    ).rejects.toThrowError(UnexpectedError);
  });
});
