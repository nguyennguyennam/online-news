import expressAsyncHandler from "express-async-handler";
import { getAllCategories } from "../queries/categories.query.js";
import { getCommentsForPost } from "../queries/comments.query.js";
import { getPost, getRelatedPosts } from "../queries/posts.query.js";
import { canViewPremium } from "../queries/users.query.js";

/**
 * GET /post: Displays the WYSIWYG editor. (?)
 *
 * - Clearance Level: 2 (Writer)
 * - Object Class: Safe
 * - Special Containment Procedures: None
 * - Addendum:
 *   + 200/OK: renders pages/writer.ejs
 *   + 401/Unauthorized: renders pages/401.ejs
 */
export const getPostHandler = expressAsyncHandler(async (req, res) => {
  const categories = await getAllCategories();
  res.render("layouts/main-layout", {
    title: "Page not found",
    description:
      "Landing page for when the requested resource could not be found.",
    content: "../pages/404",
    categories,
  });
});

/**
 * GET /post/:id: Displays a post, 5 related posts and comments.
 *
 * - Clearance Level: 0 (Anyone)
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + Accepts parameters { id: ObjectId }.
 * - Addendum:
 *   + 200/OK: renders pages/article
 *   + 401/Unauthorized: renders pages/401
 *   + 404/NotFound: renders pages/404
 */
export const getPostIdHandler = expressAsyncHandler(async (req, res) => {
  const [post, categories, comments, related] = await Promise.all([
    getPost(req.params.id),
    getAllCategories(),
    getCommentsForPost(req.params.id),
    getRelatedPosts(req.params.id),
  ]);

  // 404 if not found.
  if (post.length == 0) {
    res.render("layouts/main-layout", {
      title: "Page not found",
      description:
        "Landing page for when the requested resource could not be found.",
      content: "../pages/404",
      categories,
    });
    return;
  }

  // 401 if post is premium and clearance level <= 1 and no subscription.
  if (post[0].premium) {
    const userInfo = req.session.userInfo;
    if (!userInfo || !(await canViewPremium(userInfo.id))) {
      res.render("layouts/main-layout", {
        title: "Unauthorized",
        description: "You are not authorized to view that resource.",
        content: "../pages/401",
        categories,
      });
      return;
    }
  }

  // 200 and show if everything passed.
  res.render("layouts/main-layout", {
    title: post[0].name,
    description: post[0].abstract,
    content: "../pages/article",
    categories,
    comments,
    related,
    post: post[0],
  });
});
