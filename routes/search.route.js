import express from "express";
import { searchGetHandler } from "../controllers/search.controller.js";

const router = express.Router();
router.route("/").get(searchGetHandler);

export default router;
