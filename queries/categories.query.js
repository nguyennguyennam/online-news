import { Category } from "../model/category.model";

/**
 * Aggregates all categories and returns it into an array for easier accessing.
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
