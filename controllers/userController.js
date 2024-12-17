import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import passport from "passport";
import { saved_user } from "../queries/common.query.js";
import userModel from "../model/user.model.js";
import dotenv from "dotenv";
import session from "express-session"
dotenv.config();

// Utility function for rendering pages
function renderPage(res, title, description, content, extraData = {}) {
    res.render("layouts/main-layout", {
        title,
        description,
        content,
        homeData: { categories: [] },
        ...extraData,
    });
}

// Render pages
export const renderRegister = (req, res) => renderPage(res, "Register", "This is a register page", "../pages/register");

export const renderOTP = (req, res) => renderPage(res, "OTP Pass", "This is an OTP page", "../pages/otp_page", { email: req.session.User });

export const renderLogin = (req, res) => renderPage(res, "Log In", "This is a login page", "../pages/login");

export const renderResetPass = (req, res) => renderPage(res, "Reset Password", "This is a reset password page", "../pages/reset-password");

export const renderNewPass = (req, res) => renderPage(res, "Save New Password", "Enter your new password", "../pages/new_password", { email: req.session.User });

// User registration
export const registerUserController = async (req, res) => {
    const { fullName, dob, password, email, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        await saved_user(fullName, dob, hashedPassword, email, role);
        res.redirect("/login");
    } catch (error) {
        console.error("Registration error:", error.message);
        res.redirect("/register");
    }
};

// Check if email exists
export const fetchEmail = async (req, res) => {
    const { email } = req.body;
    const exists = await userModel.findOne({ email });
    res.status(exists ? 404 : 200).json({ message: exists ? "fail" : "success", exists });
};

// Paginate and find users
export const findUser = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const user_list = await userModel.find().skip(skip).limit(Number(limit));
        const total = await userModel.countDocuments();
        res.status(200).json({
            message: "success",
            data: user_list,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Local login
export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(404).json({ message: "fail" });
        }

        req.session.user_info = {
            id: user._id,
            gmail: user.email,
            birth_date: user.dob,
            fullName: user.fullName,
            role: user.clearance,
        };

        res.redirect("/home");
    } catch (err) {
        console.error("Login error:", err);
        res.render("404");
    }
};

// Facebook login and callback
export const loginWithFacebook = (req, res, next) => passport.authenticate("facebook")(req, res, next);

export const facebookCallbackController = (req, res, next) => {
    passport.authenticate("facebook", { failureRedirect: "/login" }, (err, user) => {
        if (err || !user) return res.redirect("/login");

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.session.user = { id: user._id, name: user.name, role: user.role };
            res.redirect("/main");
        });
    })(req, res, next);
};

// Password reset via email
export const resetPasswordController = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).render("error", { message: "Email not found." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
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

        transporter.verify((error) => {
            if (error) console.log("SMTP Error:", error);
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Password Reset",
            text: `Your OTP is: ${otp}`,
        });

        req.session.User = email;
        res.redirect("/verify-otp");
    } catch (error) {
        console.log(error.message);
        res.render("404", { message: "Failed to reset password." });
    }
};

// Verify OTP
export const verifyOtpController = async (req, res) => {
    const { password } = req.body;
    const email = req.session.User;

    try {
        const user = await userModel.findOne({ email });
        if (!user || user.password !== password) return res.render("404");

        res.redirect("/set-new-password");
    } catch (error) {
        console.log(error.message);
        res.render("404", { message: "Failed to verify OTP." });
    }
};

// Save new password
export const saveNewPasswordController = async (req, res) => {
    const { password } = req.body;
    const email = req.session.User;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.render("404", { message: "User not found." });

        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
        res.status(500).render("404", { message: "Failed to reset password." });
    }
};
