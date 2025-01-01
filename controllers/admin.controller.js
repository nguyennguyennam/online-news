import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import {
  createCategory,
  deleteCategory,
  existsCategoryWithName,
  findCategoryById,
  getAllCategories,
  updateCat,
} from "../queries/categories.query.js";
import { getAllAdminPosts } from "../queries/posts.query.js";
import { get_all_tags } from "../queries/tag.query.js";
import { getAllUsers } from "../queries/users.query.js";

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
 * GET /admin/categories: View all categories in the database.
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

/**
 * POST /admin/categories: Posts a new category.
 *
 * AJAX ROUTE.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts { name: string, parent?: string }
 * - Returns:
 *   + 201 (Created): success
 *   + 400 (Bad Request): invalid body
 *   + 409 (Conflict): name is taken
 */
export const createCategoryHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string(),
    parent: z.string().optional(),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }

  if (await existsCategoryWithName(body.data.name)) {
    res.status(409).json({ message: "Name taken" });
    return;
  }

  const parentCat = await findCategoryById(body.data.parent);
  await createCategory(body.data.name, parentCat?.name);
  res.status(201).json({});
});

/**
 * PUT /admin/categories: Updates a category's name.
 *
 * AJAX ROUTE.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts { id: string, name: string }
 * - Returns:
 *   + 200 (Success)
 *   + 409 (Conflict), name taken
 *   + 404 (Not Found), id not found
 *   + 400 (Bad Request), request was bad
 */
export const updateCategoryHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
    name: z.string(),
  });
  const body = schema.safeParse(req.body);

  if (body.error) {
    res.status(400).json({ message: "Request body was bad" });
    return;
  }

  const category = await findCategoryById(body.data.id);
  if (category == null) {
    res.status(404).json({ message: "Category does not exist" });
    return;
  }

  if (await existsCategoryWithName(body.data.name)) {
    res.status(409).json({ message: "That category already exists" });
    return;
  }

  category.name = body.data.name;
  await category.save();
  res.status(200).json({});
});

/**
 * POST /admin/categories/adopt: Adopts a category.
 *
 * AJAX route.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts { id: string, parent: string }
 * - Returns:
 *   + 200 (success)
 *   + 400 (Bad Request)
 *   + 404 (Not Found)
 */
export const adoptCategoryHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
    parent: z.union([z.string(), z.null()]),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({ message: "Request body was bad" });
    return;
  }

  const category = await findCategoryById(body.data.parent);
  const currentCat = await findCategoryById(body.data.id);
  if (currentCat == null) {
    res.status(404).json({ message: "Category does not exist" });
    return;
  }

  currentCat.parent = category?._id;
  await currentCat.save();
  res.status(200).json({});
});

/**
 * DELETE /admin/categories: Deletes a category.
 *
 * AJAX ROUTE.
 *
 * - Clearance Level: 4
 * - Object Class: Keter
 * - Special Containment Procedures:
 *   + Accepts { id: string }
 *   + If the deleted category is a parent, all of its children now become parents.
 *   + All posts under that category will be deleted.
 * - Returns:
 *   + 200 (Success)
 *   + 400 (Bad Request), request was bad
 *   + 404 (Not Found), can't find the category to delete
 */
export const deleteCategoryHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const category = await findCategoryById(body.data.id);
  if (category == null) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  await deleteCategory(category._id);
  res.status(200).json({});
});

export const update_cat_by_admin = async (req, res) => {
  const { categoryId } = req.body;
  // Debugging: Log the categoryId to check if it's being passed correctly
  console.log("Category ID:", categoryId);

  // Validate categoryId
  if (!categoryId || categoryId.trim() === "") {
    console.error("Error: Category ID is empty or invalid.");
    return res.status(400).send("Category ID is empty or invalid.");
  }
  // Extract categoryId and name from req.body
  const update_cat = updateCat(categoryId);
  res.redirect("/admin/categories");
};
