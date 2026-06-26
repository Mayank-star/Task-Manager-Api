const { Worker } = require("bullmq");

const worker = new Worker(

  "emailQueue",

  async (job) => {

    console.log("📧 Sending Email...");

    console.log(job.data);

  },

  {
    connection: {
       url: process.env.REDIS_URL,
    },
  }

);

worker.on("completed", () => {

  console.log("✅ Email Sent");

});

worker.on("failed", (job, err) => {

  console.log(err.message);

});