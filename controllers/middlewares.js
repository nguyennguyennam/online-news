import expressAsyncHandler from "express-async-handler";
import { getClearanceLevel } from "../queries/users.query.js";

export const clearanceCheck = function (level) {
  return expressAsyncHandler(async (req, res, next) => {
    const userId = req.session?.userInfo?.id;
    if ((await getClearanceLevel(userId)) < level) {
      res.render("layouts/main-layout", {
        title: "Unauthorized",
        description: "Unauthorized.",
        content: "../pages/401",
        userInfo: req.session?.userInfo,
      });
      return;
    }

    next();
  });
};
