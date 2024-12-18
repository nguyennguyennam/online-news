import express from "express";
import {
  getPostHandler,
  getPostIdHandler,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/").get(getPostHandler);
router.route("/:id").get(getPostIdHandler);

export default router;