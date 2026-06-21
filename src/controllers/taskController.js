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
