import expressAsyncHandler from "express-async-handler";
import { getAllCategories } from "../queries/categories.query";
import { get_all_tags } from "../queries/tag.query";
import { getAllUsers } from "../queries/users.query";
import { getAllAdminPosts } from "../queries/posts.query";
/**
 * GET /admin: Main admin tool page.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getAdminHandler = expressAsyncHandler(async (req, res) => {
  res.render("layouts/main-layout", {
    title: "Admin Tools",
    description: "Administrative tools only authorized for admins",
    content: "../pages/admin",
    userInfo: req.session?.userInfo,
  });
});

/**
 * GET /admin/categories: View all categories page.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getAdminCategoriesHandler = expressAsyncHandler(
  async (req, res) => {
    const categories = await getAllCategories();
    res.render("layouts/main-layout", {
      title: "All Categories",
      description:
        "Administrative tools for viewing all current available categories",
      content: "../pages/admin-categories",
      adminCategories: categories,
      userInfo: req.session?.userInfo,
    });
  },
);

export const getAdminTagsHandler = expressAsyncHandler(async (req, res) => {
  const tags = await get_all_tags();
  res.render("layouts/main-layout", {
    title: "All Tags",
    description: "Administrative tools for viewing all current available tags",
    content: "../pages/admin-tags",
    adminTags: tags,
    userInfo: req.session?.userInfo,
  });
});

export const getAdminUsersHandler = expressAsyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.render("layouts/main-layout", {
    title: "All Users",
    description: "Administrative tools for viewing all current available users",
    content: "../pages/admin-users",
    adminUsers: users,
    userInfo: req.session?.userInfo,
  });
});

export const getAdminPostsHandler = expressAsyncHandler(async (req, res) => {
  const posts = await getAllAdminPosts();
  res.render("layouts/main-layout", {
    title: "All Posts",
    description: "Administrative tools for viewing all current available posts",
    content: "../pages/admin-posts",
    adminPosts: posts,
    userInfo: req.session?.userInfo,
  });
});
