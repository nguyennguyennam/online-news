import express from "express";
import {
  getAdminCategoriesHandler,
  getAdminHandler,
} from "../controllers/admin.controller";
import { clearanceCheck } from "../controllers/middlewares";

const adminRouter = express.Router();
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);
adminRouter
  .route("/categories")
  .get(clearanceCheck(4), getAdminCategoriesHandler);

export default adminRouter;
