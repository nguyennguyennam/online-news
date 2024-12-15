import express from "express";
import {
  renderRegister,
  renderLogin,
  registerUserController,
  loginUserController,
  resetPasswordController,
  loginWithFacebook,
  facebookCallbackController,
  renderReset_pass,
  verifyOtpController, // Thêm controller xác minh OTP
  saveNewPasswordController, // Controller đặt mật khẩu mới
  renderOTP,
} from "../controllers/userController.js";
import { 
  RenderAddAccountAdmin, 
  RenderAdminArticle, 
  RenderAdminCategory, 
  RenderAdminDashboard, 
  RenderAdminEditor, 
  RenderAdminSubscriber, 
  RenderAdminTag, 
  RenderAdminWriter 
} from "../controllers/adminController.js";

const router = express.Router();

// Các route hiện có
router.get("/register", renderRegister);
router.post("/register", registerUserController);
router.get("/login", renderLogin);
router.post("/login", loginUserController);
router.get("/reset-password", renderReset_pass);
router.post("/reset-password", resetPasswordController);
router.get("/verify-otp", renderOTP);
router.post("/verify-otp", verifyOtpController); // Route xác minh OTP
router.post("/set-new-password", saveNewPasswordController); // Route đặt mật khẩu mới
router.get("/facebook", loginWithFacebook);
router.get("/facebook/callback", facebookCallbackController);

router.get("/admin/dashboard", RenderAdminDashboard)
router.get("/admin/article",RenderAdminArticle)
router.get("/admin/tag",RenderAdminTag)
router.get("/admin/category",RenderAdminCategory)
router.get("/admin/writer",RenderAdminWriter)
router.get("/admin/editor",RenderAdminEditor)
router.get("/admin/subscriber", RenderAdminSubscriber)
router.get("/admin/addAccount",RenderAddAccountAdmin)
export default router;
