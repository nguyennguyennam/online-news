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
} from "../controllers/userController.js";

const router = express.Router();

router.get("/register", renderRegister);
router.post("/register", registerUserController);
router.get("/login", renderLogin);
router.post("/login", loginUserController);
router.get("/reset-password", renderReset_pass);
router.post("/reset-password", resetPasswordController);
router.get("/facebook", loginWithFacebook);
router.get("/facebook/callback", facebookCallbackController);


export default router;
