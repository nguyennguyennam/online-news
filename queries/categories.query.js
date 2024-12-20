import mongoose from "mongoose";
import slugify from "slugify";
import {
  default as Category,
  default as categoryModel,
} from "../model/category.model.js";

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
  const result = await Category.aggregate()
    .lookup({
      from: "categories",
      localField: "parent",
      foreignField: "_id",
      as: "parentDetails",
    })
    .unwind({ path: "$parentDetails" })
    .group({
      _id: "$parent",
      name: {
        $first: "$parentDetails.name",
      },
      children: {
        $push: {
          _id: {
            $toString: "$_id",
          },
          name: "$name",
        },
      },
    })
    .sort({ _id: 1 })
    .project({
      _id: {
        $toString: "$_id",
      },
      name: 1,
      children: 1,
    });
  return result.map((node) => ({
    ...node,
    children: node.children.map((child) => ({
      ...child,
      slug: slugify(child.name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    })),
    slug: slugify(node.name, {
      lower: true,
      strict: true,
      trim: true,
    }),
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

//
export async function updateCat(old_cat, new_cat) {
  if (!Array.isArray(old_cat) || old_cat.length === 0) {
    throw new Error("Invalid input: old_cat must be a non-empty array.");
  }

  if (typeof new_cat !== "object" || Object.keys(new_cat).length === 0) {
    throw new Error("Invalid input: new_cat must be a non-empty object.");
  }

  // Cập nhật tất cả các category có tên trong danh sách old_cat
  const result = await Category.updateMany(
    { name: { $in: old_cat } }, // Điều kiện tìm kiếm
    new_cat, // Dữ liệu cập nhật
    { new: true }, // Tùy chọn cập nhật
  );

  if (result.matchedCount === 0) {
    throw new Error("No matching categories found.");
  }

  return result;
}

export async function delete_Cat(del_cat) {
  return await categoryModel.deleteOne(del_cat);
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
  const parentId = parent ? await Category.findOne({ name: parent }) : null;
  return await Category.insertMany(
    names.map((name) => ({ name, parent: parentId })),
  );
}
