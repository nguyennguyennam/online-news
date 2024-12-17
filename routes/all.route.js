import express from "express";
import { allGetHandler } from "../controllers/all.controller";

const router = express.Router();
router.route("/").get(allGetHandler);

export default router;
