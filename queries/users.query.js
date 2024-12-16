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
