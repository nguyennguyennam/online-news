import express from "express";
import fileUpload from "express-fileupload";
import { upload } from "../config/multer.js";
import {
  getPostHandler,
  getPostIdHandler,
  postImageHandler,
  postPostHandler, 
} from "../controllers/post.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getPostHandler)
  .post(
    upload.fields([
      { name: "thumbnail-large", maxCount: 1 },
      { name: "thumbnail-small", maxCount: 1 },
    ]),
    postPostHandler,
  );

router.route("/image").post(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    useTempFiles: true,
    tempFileDir: "/public/uploads/",
  }),
  postImageHandler,
);
router.route("/:id").get(getPostIdHandler);

export default router;
