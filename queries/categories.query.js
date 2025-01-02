import mongoose from "mongoose";
import slugify from "slugify";
import {
  default as Category,
  default as categoryModel,
} from "../model/category.model.js";
import { deletePostsUnderCategory } from "./posts.query.js";

/**
 * Aggregates all categories and returns it into an array for easier accessing.
 *
 * This aggregation will IGNORE ALL CATEGORIES THAT DO NOT HAVE A CHILD CATEGORY.
 *
 * Each element of the aggregated array will be in the form { _id, name, children },
 * where each children is of type { _id, name }.
 *
 * @returns All categories array
 */
export async function getAllCategories() {
  return (
    await Category.aggregate()
      .lookup({
        from: "categories",
        localField: "_id",
        foreignField: "parent",
        as: "children",
      })
      .match({ parent: null })
  ).map((cat) => ({
    ...cat,
    slug: slugify(cat.name, { lower: true, strict: true, trim: true }),
  }));
}

/**
 * Attempts to find a category by its slug.
 * This function only matches PARENTS, meaning those with the parent field
 * set to null.
 *
 * @param {string} slug
 * @returns {Promise<any | null>} the category if found.
 */
export async function findCategoryBySlug(slug) {
  const parents = await Category.aggregate().match({ parent: null });
  return parents
    .map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true, trim: true }),
    }))
    .find((v) => v.slug == slug);
}

/**
 * Retrieves children of the provided category ID.
 *
 * @param {string} catId the category id.
 * @returns {Promise<Array<any>>}
 */
export async function getChildrenCategoriesOf(catId) {
  return await Category.aggregate()
    .match({
      parent: new mongoose.Types.ObjectId(catId),
    })
    .sort({ _id: 1 });
}

/**
 * Finds a child category, using a parent slug and an additional slug.
 *
 * @param {string} parentSlug the slug of the parent.
 * @param {string} childSlug the slug of the children
 * @returns {Promise<any | null>}
 */
export async function findChildCategoryBySlug(parentSlug, childSlug) {
  const parent = await findCategoryBySlug(parentSlug);
  if (parent == null) return null;

  const children = await Category.aggregate().match({ parent: parent._id });
  return children
    .map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true, trim: true }),
    }))
    .find((v) => v.slug == childSlug);
}

/**
 * Finds a category, using the ID.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function findCategoryById(id) {
  return Category.findById(id);
}

/**
 * Checks if a category already exists with a name, after slugifying.
 *
 * @param {string} name the name of the category, after slugifying.
 * @returns {Promise<boolean>}
 */
export async function existsCategoryWithName(name) {
  const slug = slugify(name, { lower: true, strict: true, trim: true });
  return (await Category.find()).some(
    (val) =>
      slugify(val.name, { lower: true, strict: true, trim: true }) == slug,
  );
}

/**
 * Deletes a category. If the category has children, ALL of it's children becomes
 * parents.
 *
 * This also cascades and deletes all posts related.
 *
 * @param {string} id the id to delete
 */
export async function deleteCategory(id) {
  const deleting = await Category.findOneAndDelete({ _id: id });
  if (deleting == null) {
    return;
  }

  // Cascade 1, all children no longer points to this.
  await Category.updateMany({ parent: deleting._id }, { parent: null });
  // Cascade 2. drop all posts.
  await deletePostsUnderCategory(deleting._id);
}

//
export async function updateCat(old_cat, new_cat) {
  const result = await categoryModel.findByIdAndUpdate(
    { _id: old_cat },
    { name: new_cat },
    { new: true },
  );
  return result;
}

export async function fetch_sub_Cat() {
  return await categoryModel.find({
    parent: { $ne: null },
  });
}

/**
 * Creates a category with the name.
 *
 * @param {string} name
 * @param {string?} parent
 */
export async function createCategory(name, parent) {
  const parentId = parent ? await Category.findOne({ name: parent }) : null;
  return await Category.create({ name, parent: parentId });
}

/**
 * Inserts multiple sub-categories into the parent.
 * @param {string?} parent
 * @param  {...string} names
 */
export async function insertCategories(parent, ...names) {
  let parentId = parent
    ? (await Category.findOne({ name: parent }))?._id || null
    : null;
  if (parentId == null) {
    const p = await createCategory(parent);
    parentId = p._id;
  }

  return await Category.insertMany(
    names.map((name) => ({ name, parent: parentId })),
  );
}
