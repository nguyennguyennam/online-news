import express from "express";
import {
  getAdminCategoriesHandler,
  getAdminTagsHandler,
  getAdminHandler,
  getAdminUsersHandler,
  getAdminPostsHandler,
} from "../controllers/admin.controller";
import { clearanceCheck } from "../controllers/middlewares";

const adminRouter = express.Router();
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);
adminRouter
  .route("/categories")
  .get(clearanceCheck(4), getAdminCategoriesHandler);

adminRouter
  .route("/tags")
  .get(clearanceCheck(4), getAdminTagsHandler);

adminRouter
  .route("/users")
  .get(clearanceCheck(4), getAdminUsersHandler);

adminRouter
  .route("/posts")
  .get(clearanceCheck(4), getAdminPostsHandler);

export default adminRouter;
