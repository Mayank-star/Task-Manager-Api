const { Queue } = require("bullmq");

const emailQueue = new Queue("emailQueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

module.exports = emailQueue;