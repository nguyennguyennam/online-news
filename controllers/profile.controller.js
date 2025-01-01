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
 * POST /profile/update: Updates a user's profile.
 *
 * - Clearance Level: 1
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts body { fullName, dob, penName }
 */
export const postProfileUpdateHandler = expressAsyncHandler(
  async (req, res) => {
    const user = await getUser(req.session.userInfo.id);
    if (!user) {
      res.redirect("/login");
      return;
    }

    const schema = z.object({
      fullName: z.string(),
      penName: z.string().optional(),
      dob: z.coerce.date(),
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
          penName: user.penName,
          dob: user.dob,
          subscription: user.subscription,
        },
        error: body.error.issues[0].message, // Here?
      });
      return;
    }

    user.fullName = body.data.fullName;
    user.dob = body.data.dob;
    if (user.clearance >= 2) {
      user.penName = body.data.penName;
    }
    await user.save();

    res.render("layouts/main-layout", {
      title: "Profile Settings",
      description: "Update your profile information",
      content: "../pages/profile",
      userInfo: {
        ...req.session.userInfo,
        fullName: user.fullName,
        penName: user.penName,
        dob: user.dob,
        subscription: user.subscription,
      },
    });
  },
);

/**
 * POST /profile/password: Uploads and changes passwords.
 *
 * - Clearance Level: 1
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + { currentPassword: string, newPassword: string }
 */
export const postProfilePasswordHandler = expressAsyncHandler(
  async (req, res) => {
    const user = await getUser(req.session.userInfo.id);
    if (!user) {
      res.redirect("/login");
      return;
    }

    const schema = z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
    });
    const body = schema.safeParse(req.body);

    if (body.error) {
      res.render("layouts/main-layout", {
        title: "Malformed Body",
        description:
          "Landing page for when the body the user submitted is completely garbage.",
        content: "../pages/400",
        userInfo: req.session?.userInfo,
      });
      return;
    }

    if (!bcrypt.compareSync(body.data.currentPassword, user.password)) {
      res.render("layouts/main-layout", {
        title: "Profile Settings",
        description: "Update your profile information",
        content: "../pages/profile",
        userInfo: {
          ...req.session.userInfo,
          fullName: user.fullName,
          penName: user.penName,
          dob: user.dob,
          subscription: user.subscription,
        },
        error: "Wrong Password",
      });
      return;
    }

    user.password = bcrypt.hashSync(body.data.newPassword, user.password);
    await user.save();

    res.render("layouts/main-layout", {
      title: "Profile Settings",
      description: "Update your profile information",
      content: "../pages/profile",
      userInfo: {
        ...req.session.userInfo,
        fullName: user.fullName,
        penName: user.penName,
        dob: user.dob,
        subscription: user.subscription,
      },
    });
  },
);
