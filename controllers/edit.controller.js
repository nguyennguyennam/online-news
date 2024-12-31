import expressAsyncHandler from "express-async-handler";
import { getAllCategories } from "../queries/categories.query";
import { getPostById } from "../queries/posts.query";

/**
 * GET /edit:
 *
 * CURRENTLY DON'T KNOW WHAT TO DO. REDIRECT BACK TO /posts.
 */
export const getEditHandler = expressAsyncHandler(async (req, res) => {
  res.redirect("/posts");
});

/**
 * GET /edit/:id: Edits an already uploaded post.
 *
 * If a post is a draft or denied, the content can be changed.
 * If it's an editor looking, then content can't be changed, but other fields can be.
 *
 * - Clearance Level: 2 (Writer)
 * - Object Class: Safe (At the moment of this request, nothing is changed)
 */
export const getEditIdHandler = expressAsyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await getPostById(postId);

  if (post == null) {
    res.render("layouts/main-layout", {
      title: "Post not found",
      description: "That post can not be found",
      content: "../pages/404",
      userInfo: req.session?.userInfo,
    });
    return;
  }

  if (
    post.writer._id != req.session?.userInfo?.id &&
    req.session?.userInfo?.role != 4
  ) {
    res.render("layouts/main-layout", {
      title: "Not authorized",
      description: "That post can not be found",
      content: "../pages/401",
      userInfo: req.session?.userInfo,
    });
    return;
  }

  const categories = await getAllCategories();
  res.render("layouts/main-layout", {
    title: "Editing post",
    description: "Landing page for editing a post",
    content: "../pages/edit-post",
    userInfo: req.session?.userInfo,
    postCategories: categories.flatMap((p) =>
      p.children.map((n) => ({ ...n, parent: p.name })),
    ),
    post,
    tinymce: true,
  });
});
