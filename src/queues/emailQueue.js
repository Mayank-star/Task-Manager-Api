const { Queue } = require("bullmq");

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: process.env.HOST,
    port: process.env.QUEUE_PORT,
  },
});

module.exports = emailQueue;