import express from "express";
import {
  addTagHandler,
  adoptCategoryHandler,
  createCategoryHandler,
  createUserHandler,
  deleteCategoryHandler,
  deleteEditorGrantHandler,
  deleteTagHandler,
  deleteUserHandler,
  editTagHandler,
  editUserHandler,
  extendSubscriberHandler,
  getAdminCategoriesHandler,
  getAdminHandler,
  getAdminPostsHandler,
  getAdminTagsHandler,
  getAdminUsersHandler,
  getEditorGrantsHandler,
  grantEditorHandler,
  updateCategoryHandler,
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

adminRouter
  .route("/tags")
  .get(clearanceCheck(4), getAdminTagsHandler)
  .post(clearanceCheck(4), addTagHandler)
  .put(clearanceCheck(4), editTagHandler)
  .delete(clearanceCheck(4), deleteTagHandler);

adminRouter
  .route("/users")
  .get(clearanceCheck(4), getAdminUsersHandler)
  .post(clearanceCheck(4), createUserHandler)
  .put(clearanceCheck(4), editUserHandler)
  .delete(clearanceCheck(4), deleteUserHandler);
adminRouter
  .route("/users/grant")
  .get(clearanceCheck(4), getEditorGrantsHandler)
  .post(clearanceCheck(4), grantEditorHandler)
  .delete(clearanceCheck(4), deleteEditorGrantHandler);
adminRouter
  .route("/users/extend")
  .post(clearanceCheck(4), extendSubscriberHandler);

adminRouter.route("/posts").get(clearanceCheck(4), getAdminPostsHandler);
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);

export default adminRouter;
