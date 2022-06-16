const Activity = require("../../domains/Activity");
const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const ActivityService = require("../../services/ActivityService");
const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("ActivityRepository");
});

describe("ActivityService의 createActivity", () => {
  test("activity의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.createActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });

  test("activity의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.createActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });

  test("activity의 userId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.createActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("ActivityService의 deleteActivity", () => {
  test("activity의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.deleteActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });

  test("activity의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.deleteActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });

  test("activity의 userId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.deleteActivity(new Activity())
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("ActivityService의 selectActivities", () => {
  test("user의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.selectActivities(new User())
    ).rejects.toThrowError(ArgumentError);
  });

  test("user의 email이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("ActivityRepository", {});
    const activityService = new ActivityService(Container);

    expect(
      async () => await activityService.selectActivities(new User())
    ).rejects.toThrowError(ArgumentError);
  });
});
