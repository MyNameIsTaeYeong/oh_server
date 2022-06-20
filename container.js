const { writePOOL, readPOOL } = require("./db");
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
Container.set("POOL", writePOOL);

// ActivityOccur
Container.set(
  "RecordOccurRepository",
  new MySqlActivityOccurRepository(Container)
);
Container.set(
  "ActivityOccurServiceForWrite",
  new RecordOccurService(Container)
);

// Activity
Container.set("RecordRepository", new MySqlActivityRepository(Container));
Container.set("ActivityServiceForWrite", new RecordService(Container));

// EmotionOccur
Container.set(
  "RecordOccurRepository",
  new MySqlEmotionOccurRepository(Container)
);
Container.set("EmotionOccurServiceForWrite", new RecordOccurService(Container));

// Emotion
Container.set("RecordRepository", new MySqlEmotionRepository(Container));
Container.set("EmotionServiceForWrite", new RecordService(Container));

// ShareTag
Container.set("shareTagRepository", new MySqlShareTagRepository(Container));
Container.set("ShareTagServiceForWrite", new ShareTagService(Container));

// Like
Container.set("LikeRepository", new MySqlLikeRepository(Container));
Container.set("LikeServiceForWrite", new LikeService(Container));

// POOL
Container.set("POOL", readPOOL);

// ActivityOccur
Container.set(
  "RecordOccurRepository",
  new MySqlActivityOccurRepository(Container)
);
Container.set("ActivityOccurServiceForRead", new RecordOccurService(Container));

// Activity
Container.set("RecordRepository", new MySqlActivityRepository(Container));
Container.set("ActivityServiceForRead", new RecordService(Container));

// EmotionOccur
Container.set(
  "RecordOccurRepository",
  new MySqlEmotionOccurRepository(Container)
);
Container.set("EmotionOccurServiceForRead", new RecordOccurService(Container));

// Emotion
Container.set("RecordRepository", new MySqlEmotionRepository(Container));
Container.set("EmotionServiceForRead", new RecordService(Container));

// ShareTag
Container.set("shareTagRepository", new MySqlShareTagRepository(Container));
Container.set("ShareTagServiceForRead", new ShareTagService(Container));

// Like
Container.set("LikeRepository", new MySqlLikeRepository(Container));
Container.set("LikeServiceForRead", new LikeService(Container));

// User
Container.set("UserRepository", new MySqlUserRepository(Container));
Container.set("UserService", new UserService(Container));
