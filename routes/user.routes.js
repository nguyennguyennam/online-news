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
  const { recaptchaResponse } = req.body;
  console.log(recaptchaResponse);
  const secretKey = "6LfS-KsqAAAAAKyZ_edYvKKQpS5iv83-iv1ToqZz";

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`, {
      method: "POST",
    });
    const data = await response.json();
    if (!data.success) {
      console.error("Xác thực reCAPTCHA thất bại:", data["error-codes"]);
      return res.json({ success: false, error: "Xác thực reCAPTCHA thất bại. Vui lòng thử lại." });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xác thực reCAPTCHA:", error);
    res.status(500).json({ success: false, error: "Đã xảy ra lỗi trong quá trình xác thực reCAPTCHA." });
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
