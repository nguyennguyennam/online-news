import categoryModel from "../model/category.model";
import Category from "../model/category.model";

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
  return await Category.aggregate()
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
    .project({
      _id: {
        $toString: "$_id",
      },
      name: 1,
      children: 1,
    });
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
      { new: true } // Tùy chọn cập nhật
  );

  if (result.matchedCount === 0) {
      throw new Error("No matching categories found.");
  }

  return result;
}

export async function create_Cat (new_cat) {
  return await categoryModel.create(new_cat);
}

export async function delete_Cat (del_cat) {
  return await categoryModel.deleteOne(del_cat);
}