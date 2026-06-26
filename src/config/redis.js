const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

// Redis Error
redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

// Redis Connected
redisClient.on("connect", () => {
  console.log("Redis Connected");
});

module.exports = redisClient;