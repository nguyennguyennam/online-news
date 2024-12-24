import express from "express";
import {
    renderRegister,
    renderLogin,
    registerUserController,
    loginUserController,
    resetPasswordController,
    loginWithFacebook,
    facebookCallbackController,
    verifyOtpController, 
    saveNewPasswordController, 
    renderOTP,
    fetchEmail, 
    renderResetPass,
    renderNewPass
} from "../controllers/userController.js";

import { homeGetHandler } from "../controllers/home.controller.js";
const router = express.Router();

//router.get("/home", homeGetHandler);
router.post("/check-email", fetchEmail);
router.get("/register", renderRegister);
router.post("/register", registerUserController);
router.get("/login", renderLogin);
router.post("/login", loginUserController);
router.get("/reset-password", renderResetPass);
router.post("/reset-password", resetPasswordController);
router.get("/verify-otp", renderOTP);
router.post("/verify-otp", verifyOtpController); 
router.get("/set-new-password", renderNewPass);
router.post("/set-new-password", saveNewPasswordController); 
router.get("/facebook", loginWithFacebook);
router.get("/facebook/callback", facebookCallbackController);
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home"); // Chuyển về trang home sau khi đăng xuất
});
export default router;
