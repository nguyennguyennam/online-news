import express from "express";
import userRoutes from "./user.routes.js"; // Import các route cụ thể từ file user.routes.js

const router = express.Router();

// Tích hợp các route của user
router.use(userRoutes);
export default router;
