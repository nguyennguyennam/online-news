import express from "express";
import {PDFDocument} from "pdf-lib";
import fileUpload from "express-fileupload";
import { upload } from "../config/multer.js";
import {
  getPostHandler,
  getPostIdHandler,
  postImageHandler,
  postPostHandler,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/generate-pdf/:postId", async (req, res) => {
  const postId = req.params.postId;
  const post = await PostModel.findById(postId);

  if (!post || post.state !== "premium") {
    return res.status(404).send("Post not found or not premium.");
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(post.content, { x: 50, y: 700, size: 12 });

  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=article-${postId}.pdf`);
  res.send(pdfBytes);
});

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
