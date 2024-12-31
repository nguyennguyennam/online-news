import express from "express";
import {
  getPostByCatController,
  getPostsByChildCatController,
} from "../controllers/category.controller.js";

const router = express.Router();
router.route("/:parent/:child").get(getPostsByChildCatController);
router.route("/:id").get(getPostByCatController);

export default router;
