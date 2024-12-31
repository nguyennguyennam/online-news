import User from "../model/user.model.js";

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

/**
 * Retrieves the clearance level of a user.
 *
 * @returns {User} all users
 */
export async function getAllUsers() {
  return await User.find({});
}
