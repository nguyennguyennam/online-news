import editorModel from "../model/editor.model.js";
import userModel from "../model/user.model.js";
import categoryModel from "../model/category.model.js";
// Manage users

/**
 * Retrieves all users, grouped by their clearance level.
 *
 * This function uses MongoDB aggregation to group users based on their 'clearance' field,
 * then it renames the '_id' field to 'clearance' and includes all user information in the result.
 *
 * @returns {Array} The grouped users by clearance level.
 */
export async function get_Users() {
  const result = await userModel.aggregate([
    // Group users by clearance
    {
      $group: {
        _id: "$clearance", // Group by clearance level
        users: {
          $push: "$$ROOT", // Include all fields of the user document
        },
      },
    },
    // Rename _id to clearance and exclude _id in the final result
    {
      $project: {
        _id: 0, // Exclude _id field
        clearance: "$_id", // Rename _id to clearance
        users: 1, // Include the users array in the result
      },
    },
  ]);
  return result;
}

/**
 * Updates the editor's authorized categories by the given category name.
 *
 * This function finds the category by its name and then updates the 'authorizedCategories'
 * field in the editor's document with the corresponding category IDs.
 *
 * @param {string} id_editor - The ID of the editor to be updated.
 * @param {string} cat_name - The name of the category to be assigned to the editor.
 * @returns {Object} The updated editor document.
 */
export async function update_cat_by_Editors(id_editor, cat_name) {
  // Find the category by its name
  const categories = await categoryModel.find(
    { name: cat_name },
    { _id: 1 }, // Only return the _id field
  );

  // Update the editor's authorizedCategories with the category IDs
  return await editorModel.findByIdAndUpdate(
    id_editor,
    { authorizedCategories: categories.map((cat) => cat._id) }, // Map category documents to their IDs
    { new: true }, // Return the updated editor document
  );
}

/**
 * Finds users with a clearance of 1 whose subscription has expired for more than 7 days.
 *
 * This function checks if the user's subscription has expired (before today) and if it
 * expired more than 7 days ago.
 *
 * @returns {Array} A list of users who meet the criteria.
 */
export async function expire_subs() {
  const current_date = Date.now(); // Get current date in milliseconds
  const seven_days_ago = current_date - 7 * 24 * 60 * 60 * 1000; // Calculate the timestamp for 7 days ago

  // Find users whose subscription expired before today and more than 7 days ago
  return await userModel.find({
    clearance: 1, // Filter users with clearance level 1
    subscription: {
      $lt: current_date, // Subscription expired before today
    },
    $and: [
      {
        subscription: {
          $lt: seven_days_ago, // Subscription expired more than 7 days ago
        },
      },
    ],
  });
}

/**
 * Extends the subscription of a subscriber by updating the subscription date to the current date.
 *
 * This function updates the 'subscription' field of the specified subscriber with the current date,
 * effectively extending their subscription.
 *
 * @param {string} id_subs - The ID of the subscriber whose subscription is being extended.
 * @returns {Object} The updated subscriber document.
 */
export async function subscriber_extend(id_subs) {
  const current_date = Date.now(); // Get current date in milliseconds

  // Update the subscription field to the current date
  return await userModel.findByIdAndUpdate(
    id_subs,
    {
      subscription: current_date + 7*24*60*60*1000, // Set the subscription date to current date
    },
    { new: true }, // Return the updated subscriber document
  );
}

/**
 Fetch all of the editors and categories existing in the database 
 */

export const fetchEditorsAndCategories = async () => {
  const [editors, categories] = await Promise.all([
    editorModel.find(),
    categoryModel.find(),
  ]);
  return [editors, categories];
};
