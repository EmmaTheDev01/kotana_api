import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// User registration controllers
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email address is already in use",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hash,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    // Use global error handling middleware for error handling
    res.status(500).json({
      success: false,
      message: "Failed to create a user, try again",
    });
  }
};

// User authentication controllers
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.online = true;
    await user.save();

    const { _id, ...rest } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // Change token expiry to 1 hour
    );

    // Save the token as a cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour expiry
      secure: true, // Set the Secure flag
    });

    res.status(200).json({
      token,
      data: { ...rest },
    });

  } catch (err) {
    // Use global error handling middleware for error handling
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
};
