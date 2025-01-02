import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import { z } from "zod";
import { subscriber_extend } from "../queries/admin.query.js";
import {
  createCategory,
  deleteCategory,
  existsCategoryWithName,
  findCategoryById,
  getAllCategories,
} from "../queries/categories.query.js";
import { getAllAdminPosts } from "../queries/posts.query.js";
import {
  addTag,
  deleteTag,
  editTag,
  get_all_tags,
  hasTag,
} from "../queries/tag.query.js";
import {
  getAllUsers,
  getAllUsersAdmin,
  getUserByEmail,
} from "../queries/users.query.js";
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

/**
 * GET /admin/users: View all users.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getAdminUsersHandler = expressAsyncHandler(async (req, res) => {
  const users = await getAllUsersAdmin();
  res.render("layouts/main-layout", {
    title: "All Users",
    description: "Administrative tools for viewing all current available users",
    content: "../pages/admin-users",
    adminUsers: users,
    userInfo: req.session?.userInfo,
  });
});

export const getAdminUsersEditHandler = expressAsyncHandler(
  async (req, res) => {
    const users = await getAllUsers();
    res.render("layouts/main-layout", {
      title: "All Users",
      description: "Administrative tools for editing users",
      content: "../pages/admin-edit-user",
      AdminEditUsers: users,
      userInfo: req.session?.userInfo,
    });
  },
);

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

/**
 * PUT /admin/users: Edit a user's information.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 * - Returns:
 *   + 200 (Success)
 *   + 400 (Bad Request)
 *   + 404 (Not Found)
 *   + 409 (Conflict)
 */
export const putUserHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    password: z.string().optional(),
    clearance: z.coerce.number().min(1).max(3),
    dob: z.coerce.date(),
    penName: z.string().optional(),
    authCategories: z.string().optional(),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({});
    return;
  }

  const user = await getUser(body.data.id);
  if (user == null) {
    res.status(404).json({});
    return;
  }

  if ((await getUserByEmail(body.data.email)).some((u) => u._id != user._id)) {
    res.status(409).json({});
    return;
  }

  user.fullName = body.data.fullName;
  user.email = body.data.email;
  user.clearance = body.data.clearance;
  user.dob = body.data.dob;
  user.penName = body.data.penName;

  if (body.data.password)
    user.password = bcrypt.hashSync(body.data.password, 12);

  await user.save();
  if (user.clearance == 3 && body.data.authCategories) {
  }

  res.status(200).json({});
});

/**
 * POST /admin/tags: Create a new tag.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const addTagHandler = expressAsyncHandler(async (req, res) => {
  const { tag } = req.body;
  const slugifed = slugify(tag, { lower: true, strict: true, trim: true });
  if (await hasTag(slugifed)) {
    res.status(409).json({});
    return;
  }

  await addTag(slugifed);
  res.status(201).json({});
});

/**
 * PUT /admin/tags: Edits a tag.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const editTagHandler = expressAsyncHandler(async (req, res) => {
  const { id, tag } = req.body;
  const slug = slugify(tag, { lower: true, strict: true, trim: true });
  if (await hasTag(slug)) {
    res.status(409).json({});
    return;
  }

  await editTag(id, tag);
  res.status(200).json({});
});

/**
 * DELETE /admin/tags: Delete a tag.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const deleteTagHandler = expressAsyncHandler(async (req, res) => {
  const { tag } = req.body;
  const result = await deleteTag(tag);

  if (result == null) res.status(404).json({});
  else res.status(200).json({});
});

export const extendSubscriberHandler = async (req, res) => {
  const { userId } = req.body;
  console.log(req.body);
  await subscriber_extend(userId);
  res.redirect("/admin/users");
};
