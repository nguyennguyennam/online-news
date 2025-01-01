import express from "express";
import {
  adoptCategoryHandler,
  createCategoryHandler,
  deleteCategoryHandler,
  getAdminCategoriesHandler,
  getAdminHandler,
  getAdminPostsHandler,
  getAdminTagsHandler,
  getAdminUsersHandler,
  updateCategoryHandler,
} from "../controllers/admin.controller";
import { clearanceCheck } from "../controllers/middlewares";

const adminRouter = express.Router();

// Categories routes.
adminRouter
  .route("/categories")
  .get(clearanceCheck(4), getAdminCategoriesHandler)
  .put(clearanceCheck(4), updateCategoryHandler)
  .post(clearanceCheck(4), createCategoryHandler)
  .delete(clearanceCheck(4), deleteCategoryHandler);
adminRouter
  .route("/categories/adopt")
  .post(clearanceCheck(4), adoptCategoryHandler);

adminRouter.route("/tags").get(clearanceCheck(4), getAdminTagsHandler);
adminRouter.route("/users").get(clearanceCheck(4), getAdminUsersHandler);
adminRouter.route("/posts").get(clearanceCheck(4), getAdminPostsHandler);
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);

export default adminRouter;
