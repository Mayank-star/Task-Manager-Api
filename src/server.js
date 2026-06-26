require("dotenv").config();

const app = require("./app");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect Redis
    await redisClient.connect();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error);

    process.exit(1);
  }
}

startServer();