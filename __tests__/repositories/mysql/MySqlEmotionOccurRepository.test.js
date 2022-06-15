const EmoOccur = require("../../../domains/EmoOccur");
const Emotion = require("../../../domains/Emotion");
const User = require("../../../domains/User");
const ReadError = require("../../../errors/ReadError");
const UnexpectedError = require("../../../errors/UnexpectedError");
const WriteError = require("../../../errors/WriteError");
const MySqlEmotionOccurRepository = require("../../../repositories/mysql/MySqlEmotionOccurRepository");

const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("POOL");
});

describe("MySqlEmotionOccurRepository의 save()", () => {
  test("save()는 저장된 감정발생 아이디를 반환해야 한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([{ insertId: 1 }]);
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(await mySqlEmotionOccurRepository.save(new EmoOccur())).toBe(1);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.save(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 ECONNREFUSED 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.save(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.save(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("save()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.save(new EmoOccur())
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlEmotionOccurRepository의 remove()", () => {
  test("remove()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.remove(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 ECONNREFUSED 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.remove(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.remove(new EmoOccur())
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.remove(new EmoOccur())
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

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );

    const expected = await mySqlEmotionOccurRepository.findByUserId(new User());
    expect(expected.length).toBe(2);
  });

  test("findByUserId()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );

    expect(
      async () => await mySqlEmotionOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 ECONNREFUSED 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );

    expect(
      async () => await mySqlEmotionOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );

    expect(
      async () => await mySqlEmotionOccurRepository.findByUserId(new User())
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () => await mySqlEmotionOccurRepository.findByUserId(new User())
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

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );

    const expected = await mySqlEmotionOccurRepository.findByRecordId(
      new Emotion()
    );

    expect(expected.length).toBe(2);
  });

  test("findByRecordId()는 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () =>
        await mySqlEmotionOccurRepository.findByRecordId(new Emotion())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 ECONNREFUSED 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () =>
        await mySqlEmotionOccurRepository.findByRecordId(new Emotion())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () =>
        await mySqlEmotionOccurRepository.findByRecordId(new Emotion())
    ).rejects.toThrowError(ReadError);
  });

  test("findByRecordId()는 그 외의 에러시 UnexpectedError를 발생시킨다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "unexpected" });
      },
    });

    const mySqlEmotionOccurRepository = new MySqlEmotionOccurRepository(
      Container
    );
    expect(
      async () =>
        await mySqlEmotionOccurRepository.findByRecordId(new Emotion())
    ).rejects.toThrowError(UnexpectedError);
  });
});
