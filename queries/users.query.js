import User from "../model/user.model.js";
import { deletePostsBy } from "./posts.query.js";

/**
 * Checks if a user with the provided ID has a valid subscription.
 *
 * @param {string?} userId
 * @returns {Promise<boolean>}
 */
export async function hasSubscription(userId) {
  const user = await User.findById(userId);
  return (
    user &&
    user.subscription &&
    user.subscription.getTime() > new Date().getTime()
  );
}

/**
 * Finds a user with the provided ID.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getUser(id) {
  return await User.findById(id);
}

/**
 * Finds users with the provided email.
 *
 * @param {string} email
 * @returns {Promise<Array<any>>}
 */
export async function getUserByEmail(email) {
  return await User.find({ email });
}

/**
 * Checks if a user can view a premium post.
 *
 * A user can view the post if their clearance level is 2 (Writer) or higher,
 * or has a valid susbcription.
 *
 * @param {string?} userId
 * @returns {Promise<boolean>}
 */
export async function canViewPremium(userId) {
  const user = await User.findById(userId);
  return (
    user &&
    (user.clearance > 1 ||
      (user.subscription && user.subscription.getTime() > new Date().getTime()))
  );
}

/**
 * Retrieves the clearance level of a user.
 *
 * @param {string} userId the user's id
 * @returns {Promise<number>} the clearance level
 */
export async function getClearanceLevel(userId) {
  const user = await User.findById(userId);
  return user ? user.clearance : 0;
}

export async function getAllUsersAdmin() {
  return await User.find({});
}

/**
 * Creates a new user.
 *
 * @param {any} param0
 */
export async function createUser({
  fullName,
  dob,
  email,
  password,
  clearance,
}) {
  await User.create({ fullName, dob, email, password, clearance });
}

/**
 * Deletes a user with the provided ID.
 *
 * @param {string} id
 */
export async function deleteUser(id) {
  await deletePostsBy(id);
  return await User.findOneAndDelete({ _id: id, clearance: { $lt: 4 } });
}

/**
 * Retrieves the clearance level of a user and group them by their clearance.
 *
 * @returns {User[]} A list of users grouped by their clearance level.
 */
export async function getAllUsers() {
  return await User.aggregate([
    {
      $group: {
        _id: "$clearance", // Group by the 'clearance' field
        users: { $push: "$$ROOT" }, // Push all user documents into the 'users' array
      },
    },
    {
      $project: {
        _id: 0, // Hide the _id field
        clearance: "$_id", // Rename _id to 'clearance'
        users: 1, // Include the 'users' array
      },
    },
  ]);
}

export async function subscribe(id) {
  await User.updateOne({ _id: id }, { requestingSubscription: true });
}
