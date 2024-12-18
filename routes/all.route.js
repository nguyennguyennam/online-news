import express from "express";
import { allGetHandler } from "../controllers/all.controller.js";

const router = express.Router();
router.route("/").get(allGetHandler);

export default router;