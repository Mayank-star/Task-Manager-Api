const db = require("../config/db");

exports.createTask =
async (
 title,
 description,
 userId
)=>{

 return await db.query(
 `
 INSERT INTO tasks
 (
  title,
  description,
  user_id
 )
 VALUES(?,?,?)
 `,
 [
   title,
   description,
   userId
 ]
 );
};