import express from "express";
import {PDFDocument, StandardFonts} from "pdf-lib";
import fileUpload from "express-fileupload";
import { upload } from "../config/multer.js";
import { getPostById } from "../queries/posts.query.js";
import {
  getPostHandler,
  getPostIdHandler,
  postImageHandler,
  postPostHandler,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/generate-pdf/:postId", async (req, res) => {
  try {
  const postId = req.params.postId;
  console.log("postId::", postId);

  const post = await getPostById(postId);
  console.log("Post content:", post.content); // Debug content

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  console.log("pdfDoc:", pdfDoc);

  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 2;
  const maxWidth = 500;
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 750; // Starting y-coordinate
  // Split content into lines by \n and process each line
  const lines = post.content.split("\n");

  const words = post.content.split(" ");
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const width = helveticaFont.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth) {
      page.drawText(line, { x: margin, y, size: fontSize });
      line = word + " ";
      y -= lineHeight;

      if (y < margin) {
        // Add a new page if the content exceeds the current page
        page = pdfDoc.addPage([600, 800]);
        y = 750;
      }
    } else {
      line = testLine;
    }
  }

  // Draw the last line
  if (line) {
    page.drawText(line.trim(), { x: margin, y, size: fontSize });
  }

  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=article-${postId}.pdf`);
  res.send(pdfBytes);
} catch (error) {
  console.error("Error generating PDF:", error);
  res.status(500).send("An error occurred while generating the PDF.");
}
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
