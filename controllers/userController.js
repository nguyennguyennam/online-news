
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import passport from "passport";
import { saved_user } from "../queries/common.query.js";
import userModel from "../model/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// Render trang đăng ký
export function renderRegister(req, res) {
    const message = req.session.message || null; // Lấy thông báo từ session
    req.session.message = null; // Xóa thông báo sau khi hiển thị

    res.render("register", {
        successMessage: message, // Truyền thông báo thành công vào view
        errorMessage: null, // Đặt mặc định lỗi là null
    });
}

// Render trang đăng nhập
export function renderLogin(req, res) {
    res.render("login");
}
export function renderReset_pass (req, res) {
    res.render("reset-password");
}
// Đăng ký người dùng
export async function registerUserController(req, res) {
    const { fullName, dob, password, email, role } = req.body;
    console.log("Received data:", req.body); // Log dữ liệu nhận được từ form

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        await saved_user(fullName, dob, hashedPassword, email, role);
        req.session.message = "successfully.";
        res.redirect("/register");
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).render("register", { errorMessage: "Failed to register user. Please try again." });
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
            return res.status(404).json({message: "fail"});
        }
        const pass_check = await  bcrypt.compare(password, user.password);
        if (!pass_check) {
            return res.status(404).json({message: "fail"});
        }
        req.session.user = {
            id: user._id,
            gmail: user.email,
            birth_date: user.dob,
            fullName: user.fullName,
            role: user.clearance,
        };
        
        // Chuyển hướng dựa trên `clearance`
        let redirectUrl;
        switch (user.clearance) {
            case 1:
                redirectUrl = "/subscriber"; // Subscriber page
                break;
            case 2:
                redirectUrl = "/writer"; // Writer page
                break;
            case 3:
                redirectUrl = "/editor"; // Editor page
                break;
            case 4:
                redirectUrl = "/admin"; // Admin page
                break;
        }
        return res.status(200).json({ message: "success", redirectUrl });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// Đăng nhập qua Facebook
export function loginWithFacebook(req, res, next) {
    passport.authenticate("facebook")(req, res, next);
}

// Callback từ Facebook
export function facebookCallbackController(req, res, next) {
    passport.authenticate("facebook", { failureRedirect: "/login" }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.session.user = { id: user._id, name: user.name, role: user.role };
            res.redirect("/main");
        });
    })(req, res, next);
}

// Reset mật khẩu qua email
export async function resetPasswordController(req, res) {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).render("error", { message: "Email not found." });
        }
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        console.log("SMTP_HOST:", process.env.SMTP_HOST);
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS:", process.env.SMTP_PASS);
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
            text: `Your new password is: ${newPassword}`,
        });

        res.render("success", { message: "Password reset email sent successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).render("error", { message: "Failed to reset password." });
    }
}

