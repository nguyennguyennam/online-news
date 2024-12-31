import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("layouts/main-layout", {
        title: "Appove post",
        description: "A text editor for reviewing a post.",
        content: "../pages/editor-post",
        userInfo: req.session?.userInfo,
      });
});

export default router;
