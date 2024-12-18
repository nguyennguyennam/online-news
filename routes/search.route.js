import express from "express";
import { searchGetHandler } from "../controllers/search.controller";

const router = express.Router();
router.route("/").get(searchGetHandler);

export default router;
