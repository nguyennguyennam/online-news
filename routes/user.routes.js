import express from "express";
import {
  renderRegister,
  renderLogin,
  registerUserController,
  loginUserController,
  resetPasswordController,
  loginWithGoogle,
  GoogleCallbackController,
  renderReset_pass,
  verifyOtpController,
  saveNewPasswordController,
  renderOTP,
  fetchEmail,
  render_NewPass,
} from "../controllers/userController.js";

import { homeGetHandler } from "../controllers/home.controller.js";
const router = express.Router();

router.get("/home", homeGetHandler);
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
  res.redirect("/home"); // Chuyển về trang home sau khi đăng xuất
});
export default router;