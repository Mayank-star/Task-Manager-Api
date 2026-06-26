const redisClient = require("../config/redis");

exports.clearUserTaskCache = async (userId) => {
  try {
    const keys = await redisClient.keys(`tasks:${userId}:*`);

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Task Cache Cleared");
    }
  } catch (error) {
    console.log("Redis Cache Error:", error.message);
  }
};