import postModel from "../model/post.model.js";
import editorModel from "../model/editor.model.js";
import categoryModel from "../model/category.model";
import tagModel from "../model/tag.model";
import { promise } from "zod";

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
  if (!["deny", "approved"].includes(status)) {
    throw new Error("Invalid status. Allowed values: 'deny', 'approved'.");
  }

  if (status === "deny") {
    return await postModel.findByIdAndUpdate(
      post_id, 
      {
        editor: editor_id,
        state: status,
        reason_of_deny: reason, // Reason for denial
      },
      { new: true }, 
    );
  } else if (status === "approved") {
    const now = new Date();
    if (new Date(datePublish) < now) {
      throw new Error("Publish date must be in the future.");
    }
    return await postModel.findByIdAndUpdate(
      post_id, 
      {
        editor: editor_id,
        state: status,
        category: category, 
        tags: tags, // Tags
        publishedDate: datePublish, 
      },
      { new: true },
    );
  }
}

/**
 * Fetch all posts in "Draft" state and their categories that are managed by the specified editor.
 */
 export const posts_fetched = async(id_editor) => {
    const editor = await editorModel.findById(id_editor);
    const categories = editor.authorizedCategories;
    return await postModel.find(
      {category: { $in: categories },
       state: "draft"
    })
  };
