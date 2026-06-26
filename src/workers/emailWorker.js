const { Worker } = require("bullmq");

const worker = new Worker(

  "emailQueue",

  async (job) => {

    console.log("📧 Sending Email...");

    console.log(job.data);

  },

  {
    connection: {
      host: process.env.HOST,
      port: process.env.QUEUE_PORT,
    },
  }

);

worker.on("completed", () => {

  console.log("✅ Email Sent");

});

worker.on("failed", (job, err) => {

  console.log(err.message);

});