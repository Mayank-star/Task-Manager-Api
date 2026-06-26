const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { addWelcomeEmailJob } = require("../jobs/emailJob");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users(name,email,password) VALUES(?,?,?)", [
      name,
      email,
      hashedPassword,
    ]);
    await addWelcomeEmailJob({
      name,
      email
    });
    return res.status(201).json({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length == 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }

    const signPayload = {
      id: user.id,
      email: user.email,
      role:user.role
    };

    const accessToken = jwt.sign(signPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(signPayload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    await db.query(
      `
      UPDATE users
      SET refresh_token = ?
      WHERE id = ?
      `,
      [refreshToken, user.id],
    );
    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role:user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const [users] = await db.query(`SELECT * FROM users WHERE ID = ?`, [
      decoded.id,
    ]);

    if (users.length == 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const signPayload = {
      id: user.id,
      email: user.email,
      role:user.role
    };

    if (user?.refresh_token !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(signPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
