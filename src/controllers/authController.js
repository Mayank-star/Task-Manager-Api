const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

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

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

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
        id : user.id,
        email : user.email
    }

    const token =  jwt.sign(signPayload,process.env.JWT_SECRET,{expiresIn:'1d'})
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
