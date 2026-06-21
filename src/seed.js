require("dotenv").config();

const db = require("./config/db");

async function seed() {

  for(let i=1;i<=30;i++){

    await db.query(
      `
      INSERT INTO tasks
      (title,description,user_id)
      VALUES(?,?,?)
      `,
      [
        `Task ${i}`,
        `Description ${i}`,
        1
      ]
    );
  }

  console.log("Done");
  process.exit();
}

seed();