import express from "express";
import { homeGetHandler } from "../controllers/home.controller";

const router = express.Router();
router.route("/").get(homeGetHandler);

export { router as homeRouter };
