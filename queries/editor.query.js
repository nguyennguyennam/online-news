import mongoose from "mongoose";
import categoryModel from "../model/category.model.js";
import editorModel from "../model/editor.model.js";
import postModel from "../model/post.model.js";
import tagModel from "../model/tag.model.js";
import userModel from "../model/user.model.js";

/**
 * Retrieves the editor profile for a user.
 *
 * @param {string} userId
 * @returns {Promise<any>}
 */
export async function getOrCreateEditorProfile(userId) {
  let profile = await editorModel.findOne({ user: userId });
  if (profile == null) profile = await editorModel.create({ user: userId });
  return profile;
}

/**
 * Gets authorized categories of a user.
 *
 * @param {string} user
 * @returns
 */
export async function getAuthorizedCategories(user) {
  return editorModel
    .aggregate()
    .match({ user: new mongoose.Types.ObjectId(user) })
    .lookup({
      from: "categories",
      foreignField: "_id",
      localField: "authorizedCategories",
      as: "authorizedCategories",
    });
}

/**
 * Handles the approval or denial of a post.
 *
 * This function checks the status of the post and performs the corresponding action:
 * - If the status is 'deny', the post's state is set to 'deny', and the reason for denial is recorded.
 * - If the status is 'approved', it checks if the provided publish date is in the future,
 *   then updates the post with the approved state, category, tags, and published date.
 *
 * @param {string} status The status of the post ('deny' or 'approved').
 * @param {string} post_id The ID of the post to be updated.
 * @param {string} reason The reason for denying the post (if status is 'deny').
 * @param {string} category The category to be assigned to the post (if status is 'approved').
 * @param {Array} tags The tags to be assigned to the post (if status is 'approved').
 * @param {Date} datePublish The date when the post will be published (if status is 'approved').
 * @returns The updated post after applying the status change.
 */
export async function checkPost(
  editor_id,
  status,
  post_id,
  reason,
  category,
  tags,
  datePublish,
) {
  if (!["denied", "approved"].includes(status)) {
    throw new Error("Invalid status. Allowed values: 'deny', 'approved'.");
  }

  if (status === "denied") {
    return await postModel.findByIdAndUpdate(
      post_id,
      {
        editor: editor_id,
        state: status,
        deniedReason: reason, // Reason for denial
      },
      { new: true },
    );
  } else if (status === "approved") {
    const now = new Date();
    if (new Date(datePublish) < now) {
      throw new Error("Publish date must be in the future.");
    }
    const tagId = await tagModel.find({ tag: { $in: tags } }, { _id: 1 });
    return await postModel.findByIdAndUpdate(
      post_id,
      {
        editor: editor_id,
        state: status,
        category: category,
        tags: tagId, // Tags
        publishedDate: datePublish,
      },
      { new: true },
    );
  }
}

/**
 * Fetch all posts in "Draft" state and their categories that are managed by the specified editor.
 */
export const fetchPosts = async (id_editor) => {
  // Step 1: Fetch user clearance from userModel
  const user = await userModel.findOne({ _id: id_editor }, { clearance: 1 });

  if (!user) {
    throw new Error("User not found");
  }

  let aggregationPipeline = [];
  const basePipeline = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category", // Ensure `category` is no longer an array
    },
    {
      $lookup: {
        from: "tags",
        foreignField: "_id",
        localField: "tags",
        as: "tags",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "writer",
        foreignField: "_id",
        as: "writer",
      },
    },
    {
      $unwind: "$writer", // Ensure `writer` is no longer an array
    },
    {
      $match: {
        state: { $ne: "published" },
      }, // Match draft posts
    },
  ];

  if (user.clearance === 4) {
    aggregationPipeline = basePipeline;
    console.log("Admin access: Fetching all draft posts.");
  } else if (user.clearance === 3) {
    // Editor: Fetch authorized categories from editorModel
    const editor = await editorModel.findOne(
      { user: id_editor },
      { authorizedCategories: 1 },
    );
    console.log("Editor:", editor); // Debug
    if (!editor) {
      throw new Error("Editor not found");
    }

    aggregationPipeline = [
      ...basePipeline,
      {
        $match: {
          $or: [
            {
              "category.parent": { $in: editor.authorizedCategories },
            },
            {
              "category._id": { $in: editor.authorizedCategories },
            },
          ],
        },
      },
    ];

    console.log("Editor access: Restricting posts to authorized categories.");
    console.log("Authorized Categories:", editor.authorizedCategories);
    console.log("Pipeline:", JSON.stringify(aggregationPipeline, null, 2));
  } else {
    throw new Error("Unauthorized access");
  }

  // Perform aggregation
  const posts = await postModel.aggregate(aggregationPipeline);

  console.log("Fetched Posts:", posts.tags); // Debug fetched posts
  return posts;
};

/**
 * Fetch all categories managed by the specified editor.
 */

export const CategoriesEditorHandler = async (id_editor) => {
  try {
    console.log("Fetching categories for editor:", id_editor); // Debug

    // Tìm user với clearance
    const user = await userModel.findOne({ _id: id_editor }, { clearance: 1 });
    if (!user) {
      throw new Error("User not found.");
    }

    // Nếu user là admin (clearance === 4), fetch tất cả categories
    if (user.clearance === 4) {
      const categories = await categoryModel.find({ parent: { $ne: null } });
      console.log("Authorized Categories (Admin):", categories); // Debug
      return categories;
    }

    // Nếu user là editor (clearance === 3), fetch categories do editor quản lý
    if (user.clearance === 3) {
      const editor = await editorModel.findOne(
        { user: id_editor },
        { authorizedCategories: 1 },
      );
      if (!editor) {
        throw new Error("Editor data not found.");
      }
      const categories = await categoryModel.find(
        {
          parent: { $in: editor.authorizedCategories },
        },
        { name: 1, _id: 1 },
      );
      console.log("Authorized Categories (Editor):", categories); // Debug
      return categories;
    }

    // Nếu clearance không hợp lệ
    throw new Error("Invalid clearance level.");
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
};
