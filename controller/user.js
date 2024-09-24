import signUpJoi from "../Joi/userJoi.js";
import User from "../model/signup.js";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import nodemailer from "nodemailer";
import crypto from "crypto";

const nodeCache = new NodeCache();

export const handleAddUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = signUpJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "email already exists" });
    }

    //     const salt = await bcrypt.genSalt(10);
    //     const hashedPassword = await bcrypt.hash(password, salt);

    const addUser = new User({
      name,
      email,
      password,
    });

    await addUser.save();
    //   console.log("User added");
    return res.status(201).json({ msg: "Success", addUser });
  } catch (error) {
    console.error("Error during signup", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const handleGetUsers = async (req, res) => {
  let allUsers;

  if (nodeCache.has("allUsers")) {
    allUsers = JSON.parse(nodeCache.get("allUsers"));
  } else {
    allUsers = await User.find({});
    nodeCache.set("allUsers", JSON.stringify(allUsers));
  }

  if (!allUsers)
    return res.status(404).json({ error: "Internal server error" });
  return res.json(allUsers);
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const handleForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `https://56fc-103-174-35-4.ngrok-free.app/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `Task Management <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password reset request",
      text: `You have requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}`,
    };

    await transporter.sendMail(message);

    res.status(200).json({ msg: "Password reset email sent", resetToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const handlePasswordReset = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // console.log("Hashed token from URL:", hashedToken);
    // console.log("Stored token in DB:", user.resetPasswordToken);
    // console.log("Token expiration time:", user.resetPasswordExpire);

    await user.save();

    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
