import express from "express";
import {
  facebookCallbackController,
  fetchEmail,
  loginUserController,
  loginWithFacebook,
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
router.get("/facebook", loginWithFacebook);
router.get("/facebook/callback", facebookCallbackController);
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home"); // Chuyển về trang home sau khi đăng xuất
});
export default router;
