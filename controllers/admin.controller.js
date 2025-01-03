import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import { z } from "zod";
import { extendSubscription } from "../queries/admin.query.js";
import {
  createCategory,
  deleteCategory,
  existsCategoryWithName,
  findCategoryById,
  getAllCategories,
} from "../queries/categories.query.js";
import {
  getAuthorizedCategories,
  getOrCreateEditorProfile,
} from "../queries/editor.query.js";
import {
  deletePost,
  getAllAdminPosts,
  getPostById,
} from "../queries/posts.query.js";
import {
  addTag,
  deleteTag,
  editTag,
  getAllTags,
  hasTag,
} from "../queries/tag.query.js";
import {
  createUser,
  deleteUser,
  getAllUsersAdmin,
  getUser,
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
  const tags = await getAllTags();
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

/**
 * GET /admin/posts: View all posts.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
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

/**
 * POST /admin/users: Add a new user.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const createUserHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string(),
    clearance: z.coerce.number().min(1).max(3),
    dob: z.coerce.date(),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({});
    return;
  }

  if ((await getUserByEmail(body.data.email)).length > 0) {
    res.status(409).json({});
    return;
  }

  await createUser(body.data);
  res.status(201).json({});
});

/**
 * PUT /admin/users: Edit a user's data
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 */
export const editUserHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    clearance: z.coerce.number().min(1).max(3),
    dob: z.coerce.date(),
  });
  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({});
    return;
  }

  const sameEmails = await getUserByEmail(body.data.email);
  if (sameEmails.length > 0 && sameEmails[0]._id != body.data.id) {
    res.status(409).json({});
    return;
  }

  const user = await getUser(body.data.id);
  if (user == null) {
    res.status(404).json({});
    return;
  }

  if (user.clearance == 4) {
    res.status(401).json({});
    return;
  }

  user.fullName = body.data.fullName;
  user.email = body.data.email;
  user.clearance = body.data.clearance;
  user.dob = body.data.dob;
  await user.save();
  res.status(200).json({});
});

/**
 * GET /admin/users/grant: Receives the editor's granted categories.
 *
 * If there is an ?all, this retrieves all categories instead, for Ajax routing.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getEditorGrantsHandler = expressAsyncHandler(async (req, res) => {
  const { id, all } = req.query;

  if (all) {
    res.status(200).json(await getAllCategories());
    return;
  }

  const user = await getUser(id);
  if (user.clearance <= 2) {
    res.status(403).json({});
    return;
  }

  await getOrCreateEditorProfile(id);
  const authCats = await getAuthorizedCategories(id);
  res.status(200).json({ categories: authCats[0].authorizedCategories });
});

/**
 * POST /admin/users/grant: Grant editors access to authorize some categories.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 */
export const grantEditorHandler = expressAsyncHandler(async (req, res) => {
  const { id, category } = req.body;
  const user = await getUser(id);
  const cat = await findCategoryById(category);
  if (user == null || cat == null) {
    res.status(404).json({});
    return;
  }

  if (user.clearance <= 2) {
    res.status(403).json({});
    return;
  }

  const editorProfile = await getOrCreateEditorProfile(id);
  const current = new Set(editorProfile.authorizedCategories);
  current.add(cat._id);
  editorProfile.authorizedCategories = [...current];
  await editorProfile.save();
  res.status(200).json({});
});

/**
 * DELETE /admin/users/grant: Remove an editor's access to a category.
 *
 * - Clearance Level: 4
 * - Object Class: Euclid
 */
export const deleteEditorGrantHandler = expressAsyncHandler(
  async (req, res) => {
    const { id, category } = req.body;
    const user = await getUser(id);
    const cat = await findCategoryById(category);
    if (user == null || cat == null) {
      res.status(404).json({});
      return;
    }

    if (user.clearance <= 2) {
      res.status(403).json({});
      return;
    }

    const editorProfile = await getOrCreateEditorProfile(id);
    editorProfile.authorizedCategories = [
      ...editorProfile.authorizedCategories.filter((n) => n && n != cat.id),
    ];
    await editorProfile.save();

    res.status(200).json({});
  },
);

/**
 * DELETE /admin/users: Delete a user.
 *
 * - Object Class: Keter
 * - Clearance Level: 4
 */
export const deleteUserHandler = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  await deleteUser(id);
  res.status(200).json({});
});

/**
 * POST /admin/users/extend: Extend a user's subscription.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const extendSubscriberHandler = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  await extendSubscription(id);
  res.status(200).json({});
});

/**
 * PUT /admin/posts: Change a post's state
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const stateChangeHandler = expressAsyncHandler(async (req, res) => {
  const { id, state, deniedReason, publishedDate } = req.body;
  const post = await getPostById(id);
  if (post == null) {
    res.status(404).json({});
    return;
  }

  try {
    post.state = state;
    if (post.state == "denied") {
      post.deniedReason = deniedReason;
    } else if (post.state == "published") {
      post.publishedDate = publishedDate;
    }

    await post.save();
    res.status(200).json({});
  } catch {
    res.status(400).json({});
  }
});

/**
 * DELETE /admin/posts: Delete a post.
 *
 * - Object Class: Euclid
 * - Clearance Level: 4
 */
export const deletePostHandler = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  const post = await deletePost(id);

  if (!post) {
    res.status(404).json({});
  } else {
    res.status(200).json({});
  }
});
