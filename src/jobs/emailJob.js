const emailQueue = require("../queues/emailQueue");

exports.addWelcomeEmailJob = async (user) => {

  await emailQueue.add(
    "welcome-email",

    {
      name: user.name,
      email: user.email,
    }

  );

};