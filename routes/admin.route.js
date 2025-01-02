import express from "express";
import {
  adoptCategoryHandler,
  createCategoryHandler,
  deleteCategoryHandler,
  extendSubscriberHandler,
  getAdminCategoriesHandler,
  getAdminHandler,
  getAdminPostsHandler,
  getAdminTagsHandler,
  getAdminUsersEditHandler,
  getAdminUsersHandler,
  updateCategoryHandler,
  update_DeleteTagHandler,
} from "../controllers/admin.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";

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

adminRouter.route("/edit/:id").get(clearanceCheck(4), getAdminUsersEditHandler);

adminRouter.route("/posts").get(clearanceCheck(4), getAdminPostsHandler);
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);

// Tags routes.
adminRouter.route("/tags").post(update_DeleteTagHandler);

//Users routes
adminRouter.route("/users/:id").post(extendSubscriberHandler);
export default adminRouter;
