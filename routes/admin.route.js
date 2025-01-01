import express from "express";
import {
  getAdminCategoriesHandler,
  getAdminTagsHandler,
  getAdminHandler,
  getAdminUsersHandler,
  getAdminPostsHandler,
  update_cat_by_admin,
  getAdminUsersEditHandler
} from "../controllers/admin.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";

const adminRouter = express.Router();
adminRouter.route("/categories").post(update_cat_by_admin)
adminRouter
  .route("/categories")
  .get(clearanceCheck(4), getAdminCategoriesHandler);

adminRouter
  .route("/categories")
  .post()

adminRouter
  .route("/tags")
  .get(clearanceCheck(4), getAdminTagsHandler);

adminRouter
  .route("/users")
  .get(clearanceCheck(4), getAdminUsersHandler);
  
adminRouter
  .route('/edit/:id')
  .get(clearanceCheck(4), getAdminUsersEditHandler);

adminRouter
  .route("/posts")
  .get(clearanceCheck(4), getAdminPostsHandler);
  adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);
export default adminRouter;
