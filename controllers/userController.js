import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import passport from "passport";
import userModel from "../model/user.model.js";
import { saved_user } from "../queries/common.query.js";
dotenv.config();

// Render trang đăng ký
export function renderRegister(req, res) {
  //const message = req.session.message || null; // Lấy thông báo từ session
  //req.session.message = null; // Xóa thông báo sau khi hiển thị

  res.render("layouts/main-layout", {
    title: "Register",
    description: "This is a register page",
    content: "../pages/register",
    categories: null,
  });
}

export function renderOTP(req, res) {
  res.render("layouts/main-layout", {
    title: "OTP pass",
    description: "This is an OTP page",
    content: "../pages/otp",
    categories: null,
    email: req.session.User,
  });
}

// Render trang đăng nhập
export function renderLogin(req, res) {
  res.render("layouts/main-layout", {
    title: "Log In",
    description: "This is a login page",
    categories: null,
    content: "../pages/login",
  });
}
export function renderReset_pass(req, res) {
  res.render("layouts/main-layout", {
    title: "Reset Password",
    description: "This is a reset password page",
    content: "../pages/reset-password",
    categories: null,
  });
}

export function render_NewPass(req, res) {
  res.render("layouts/main-layout", {
    title: "Save new password for user",
    description: "This page allows users to enter their new passwords",
    content: "../pages/new_password",
    categories: null,
    email: req.session.User,
  });
}

export async function registerUserController(req, res) {
  const { fullName, dob, password, email, role } = req.body;
  console.log("Received data:", req.body); // Log dữ liệu nhận được từ form

  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    await saved_user(fullName, dob, hashedPassword, email, role);
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).redirect("/register");
  }
}

export async function fetchEmail(req, res, next) {
  const { email } = req.body;
  const exists = await userModel.findOne({ email: email });
  if (exists) {
    return res.status(404).json({ message: "fail", exists });
  } else {
    return res.status(200).json({ message: "success", exists });
  }
}

// Đăng nhập (Local)
export async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      email: email,
    });
    if (!user) {
      // Trả về lỗi nếu không tìm thấy người dùng
      return res.status(404).json({ message: "fail" });
    }
    const pass_check = await bcrypt.compare(password, user.password);
    if (!pass_check) {
      return res.status(404).json({ message: "fail" });
    }
    req.session.userInfo = {
      id: user._id,
      gmail: user.email,
      birth_date: user.dob,
      fullName: user.fullName,
      role: user.clearance,
    };

    return res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    return res.render("404");
  }
}

// Đăng nhập qua Facebook
export function loginWithFacebook(req, res, next) {
  passport.authenticate("facebook")(req, res, next);
}

// Callback từ Facebook
export function facebookCallbackController(req, res, next) {
  passport.authenticate(
    "facebook",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.user = { id: user._id, name: user.name, role: user.role };
        res.redirect("/main");
      });
    },
  )(req, res, next);
}

// Reset mật khẩu qua email
export async function resetPasswordController(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).render("error", { message: "Email not found." });
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số
    user.password = otp;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      secureConnection: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP Error:", error);
      } else {
        console.log("Server is ready to send emails");
      }
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset",
      text: `Your OTP is : ${otp}`,
    });
    req.session.User = email;
    res.redirect("/verify-otp");
  } catch (error) {
    console.log(error.message);
    res.render("404", { message: "Failed to reset password." });
  }
}

export async function verifyOtpController(req, res) {
  const { password } = req.body;
  const email = req.session.User;
  console.log(email);
  console.log(password);
  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.render("404");
    }
    // Chuyển hướng đến trang đặt mật khẩu mới
    res.redirect("/set-new-password");
  } catch (error) {
    console.log(error.message);
    res.render("404", { message: "Failed to verify OTP." });
  }
}
export async function saveNewPasswordController(req, res) {
  const { password } = req.body;
  const email = req.session.User;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.render("404", { message: "User not found." });
    }

    // Hash mật khẩu mới và lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("404", { message: "Failed to reset password." });
  }
}
