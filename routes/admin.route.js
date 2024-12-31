import express from "express";
import {
  getAdminCategoriesHandler,
  getAdminHandler,
  getAdminPostsHandler,
  getAdminTagsHandler,
  getAdminUsersHandler,
  update_cat_by_admin,
} from "../controllers/admin.controller";
import { clearanceCheck } from "../controllers/middlewares";

const adminRouter = express.Router();
adminRouter
  .route("/categories")
  .post(update_cat_by_admin)
  .get(clearanceCheck(4), getAdminCategoriesHandler);

adminRouter.route("/tags").get(clearanceCheck(4), getAdminTagsHandler);
adminRouter.route("/users").get(clearanceCheck(4), getAdminUsersHandler);
adminRouter.route("/posts").get(clearanceCheck(4), getAdminPostsHandler);
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);

export default adminRouter;
