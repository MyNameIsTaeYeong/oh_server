const { POOL, cache } = require("./db");
const MySqlActivityOccurRepository = require("./repositories/mysql/MySqlActivityOccurRepository");
const MySqlActivityRepository = require("./repositories/mysql/MySqlActivityRepository");
const MySqlEmotionOccurRepository = require("./repositories/mysql/MySqlEmotionOccurRepository");
const MySqlEmotionRepository = require("./repositories/mysql/MySqlEmotionRepository");
const MySqlLikeRepository = require("./repositories/mysql/MySqlLikeRepository");
const MySqlShareTagRepository = require("./repositories/mysql/MySqlShareTagRepository");
const MySqlUserRepository = require("./repositories/mysql/MySqlUserRepository");
const LikeService = require("./services/LikeService");
const RecordOccurService = require("./services/RecordOccurService");
const RecordService = require("./services/RecordService");
const ShareTagService = require("./services/ShareTagService");
const UserService = require("./services/UserService");

require("reflect-metadata");
const Container = require("typedi").Container;

// POOL
Container.set("POOL", POOL);

// ActivityOccurService 의존관계
Container.set(
  "RecordOccurRepository",
  new MySqlActivityOccurRepository(Container)
);
Container.set(
  "RecordOccurRepository2",
  new MySqlEmotionOccurRepository(Container)
);
Container.set("ActivityOccurService", new RecordOccurService(Container));

// EmotionOccurService 의존관계
Container.set(
  "RecordOccurRepository",
  new MySqlEmotionOccurRepository(Container)
);
Container.set(
  "RecordOccurRepository2",
  new MySqlActivityOccurRepository(Container)
);
Container.set("EmotionOccurService", new RecordOccurService(Container));

// ActivityService 의존관계
Container.set("RecordRepository", new MySqlActivityRepository(Container));
Container.set("ActivityService", new RecordService(Container));

// EmotionService 의존관계
Container.set("RecordRepository", new MySqlEmotionRepository(Container));
Container.set("EmotionService", new RecordService(Container));

// ShareTag
Container.set("shareTagRepository", new MySqlShareTagRepository(Container));
Container.set("ShareTagService", new ShareTagService(Container));

// Like
Container.set("LikeRepository", new MySqlLikeRepository(Container));
Container.set("LikeService", new LikeService(Container));

// User
Container.set("UserRepository", new MySqlUserRepository(Container));
Container.set("UserService", new UserService(Container));

// REDIS
Container.set("cache", cache);
