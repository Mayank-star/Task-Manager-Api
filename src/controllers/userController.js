const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id,name,email FROM users WHERE id = ?",
      [req.user.id],
    );

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
