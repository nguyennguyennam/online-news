import express from "express";
import {
  getAdminCategoriesHandler,
  getAdminTagsHandler,
  getAdminHandler,
  getAdminUsersHandler,
  getAdminPostsHandler,
  getAdminUsersEditHandler,
} from "../controllers/admin.controller";
import { clearanceCheck } from "../controllers/middlewares";

const adminRouter = express.Router();
adminRouter.route("/").get(clearanceCheck(4), getAdminHandler);
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


export default adminRouter;
