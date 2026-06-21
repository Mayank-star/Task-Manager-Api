const db = require("../config/db");

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title Required",
      });
    }

    await db.query(
      "INSERT INTO tasks(title,description,user_id) values(?,?,?)",
      [title, description, req.user.id],
    );

    return res.status(201).json({
      success: true,
      message: "Task Created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const [tasks] = await db.query(
      `SELECT * FROM TASKS WHERE user_id = ?
       ORDER BY created_at DESC 
      `,
      [req.user.id],
    );

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
