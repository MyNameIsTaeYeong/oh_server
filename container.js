const { masterPOOL } = require("./db");
const MySqlActivityOccurRepository = require("./repositories/mysql/MySqlActivityOccurRepository");
const MySqlActivityRepository = require("./repositories/mysql/MySqlActivityRepository");
const MySqlEmotionOccurRepository = require("./repositories/mysql/MySqlEmotionOccurRepository");
const MySqlEmotionRepository = require("./repositories/mysql/MySqlEmotionRepository");
const MySqlUserRepository = require("./repositories/mysql/MySqlUserRepository");
const ActivityService = require("./services/ActivityService");
const ActOccurService = require("./services/ActOccurService");
const EmoOccurService = require("./services/EmoOccurService");
const EmotionService = require("./services/EmotionService");
const UserService = require("./services/UserService");

require("reflect-metadata");
const Container = require("typedi").Container;

Container.set("POOL", masterPOOL);
Container.set(
  "ActivityOccurRepository",
  new MySqlActivityOccurRepository(Container)
);
Container.set("ActivityRepository", new MySqlActivityRepository(Container));
Container.set(
  "EmotionOccurRepository",
  new MySqlEmotionOccurRepository(Container)
);
Container.set("EmotionRepository", new MySqlEmotionRepository(Container));
Container.set("UserRepository", new MySqlUserRepository(Container));
Container.set("ActivityService", new ActivityService(Container));
Container.set("ActOccurService", new ActOccurService(Container));
Container.set("EmoOccurService", new EmoOccurService(Container));
Container.set("EmotionService", new EmotionService(Container));
Container.set("UserService", new UserService(Container));
