import expressAsyncHandler from "express-async-handler";
import { getPostsBy } from "../queries/posts.query.js";
import { getClearanceLevel } from "../queries/users.query.js";

/**
 * GET /posts: Retrieves all of my posts.
 *
 * - Clearance Level: 2
 * - Object Class: Safe
 */
export const getPostsHandler = expressAsyncHandler(async (req, res) => {
  const userId = req.session?.userInfo?.id;
  if ((await getClearanceLevel(userId)) < 2) {
    res.render("layouts/main-layout", {
      title: "Unauthorized",
      description: "You're not allowed to access this resource.",
      content: "../pages/401",
      userInfo: req.session?.userInfo,
    });
    return;
  }

  const posts = await getPostsBy(userId);
  res.render("layouts/main-layout", {
    title: "My posts",
    description: "A section of my works published on The Cipher.",
    content: "../pages/post-list",
    userInfo: req.session?.userInfo,
    posts,
    states: ["draft", "denied", "approved", "published"],
  });
});
