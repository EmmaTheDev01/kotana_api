import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User registration controllers
export const register = async (req, res) => {
  try {
    const { username, email, password, photo } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      email,
      password: hash,
      photo,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create a user, try again",
    });
  }
};
//User authentication controllers
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    //if user does not exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    //if the user exist and the password is valid

    //compare password from your hash

    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if password is incorrect
    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const { password, role, ...rest } = user._doc;

    //create a jwt token

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    //Set token into the browser as cookies
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
};
