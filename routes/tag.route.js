import express from "express";
import { getTagHandler, getTagIdHandler } from "../controllers/tag.controller";

const router = express.Router();
router.route("/").get(getTagHandler);
router.route("/:slug").get(getTagIdHandler);

export default router;
