import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { getUser } from "../queries/users.query.js";

/**
 * GET /profile: View a form to edit my profile.
 *
 * - Clearance Level: 1
 * - Object Class: Safe
 */
export const getProfileHandler = expressAsyncHandler(async (req, res) => {
  if (!req.session.userInfo) {
    res.redirect("/login");
    return;
  }

  const user = await getUser(req.session.userInfo.id);
  if (!user) {
    res.redirect("/login");
    return;
  }

  res.render("layouts/main-layout", {
    title: "Profile Settings",
    description: "Update your profile information",
    content: "../pages/profile",
    userInfo: {
      ...req.session.userInfo,
      fullName: user.fullName,
      dob: user.dob,
      subscription: user.subscription,
    },
  });
});

/**
 * POST /profile: Updates a user's profile.
 *
 * - Clearance Level: 1
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts body { fullName, dob, currentPassword, newPassword }
 */
export const postProfileHandler = expressAsyncHandler(async (req, res) => {
  if (!req.session.userInfo) {
    res.redirect("/login");
    return;
  }

  const user = await getUser(req.session.userInfo.id);
  if (!user) {
    res.redirect("/login");
    return;
  }

  const schema = z.object({
    fullName: z.string(),
    dob: z.coerce.date(),
    currentPassword: z.string(),
    newPassword: z.string(),
  });
  const body = schema.safeParse(req.body);

  if (body.error) {
    // What to do?
    res.render("layouts/main-layout", {
      title: "Profile Settings",
      description: "Update your profile information",
      content: "../pages/profile",
      userInfo: {
        ...req.session.userInfo,
        fullName: user.fullName,
        dob: user.dob,
        subscription: user.subscription,
      },
      error: body.error.issues[0].message, // Here?
    });
    return;
  }

  // Not matched current password.
  if (!bcrypt.compareSync(body.data.currentPassword, user.password)) {
    res.render("layouts/main-layout", {
      title: "Profile Settings",
      description: "Update your profile information",
      content: "../pages/profile",
      userInfo: {
        ...req.session.userInfo,
        fullName: user.fullName,
        dob: user.dob,
        subscription: user.subscription,
      },
      error: "Current password doesn't match", // Here?
    });
    return;
  }

  user.fullName = body.data.fullName;
  user.dob = body.data.dob;
  user.password = bcrypt.hashSync(body.data.newPassword, 12);
  await user.save();

  res.render("layouts/main-layout", {
    title: "Profile Settings",
    description: "Update your profile information",
    content: "../pages/profile",
    userInfo: {
      ...req.session.userInfo,
      fullName: user.fullName,
      dob: user.dob,
      subscription: user.subscription,
    },
  });
});
