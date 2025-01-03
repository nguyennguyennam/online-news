import express from "express";
import {
  fetchEmail,
  GoogleCallbackController,
  loginUserController,
  loginWithGoogle,
  registerUserController,
  render_NewPass,
  renderLogin,
  renderOTP,
  renderRegister,
  renderReset_pass,
  resetPasswordController,
  saveNewPasswordController,
  verifyOtpController,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/validate-captcha", async (req, res) => {
  const secretKey = "6LfKt6wqAAAAAGP5tZZbFMrMSFHLNnchW4GbJQct";
  const { recaptchaResponse } = req.body;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${recaptchaResponse}`,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error validating reCAPTCHA:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/check-email", fetchEmail);
router.get("/register", renderRegister);
router.post("/register", registerUserController);
router.get("/login", renderLogin);
router.post("/login", loginUserController);
router.get("/reset-password", renderReset_pass);
router.post("/reset-password", resetPasswordController);
router.get("/verify-otp", renderOTP);
router.post("/verify-otp", verifyOtpController);
router.get("/set-new-password", render_NewPass);
router.post("/set-new-password", saveNewPasswordController);
router.get("/google", loginWithGoogle);
router.get("/auth/google/callback", GoogleCallbackController);
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/"); // Chuyển về trang home sau khi đăng xuất
});
export default router;
