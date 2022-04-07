const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("postShareTags", () => {
  test(
    "postShareTags는 accessToken을 인증한 사용자에게 삽입된 테그를 반환해야 한다."
  );
});
