import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mainRouter from "./routes/index.js";

import User from "./model/user.model.js";
import { getAllCategories } from "./queries/categories.query.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Setup view engine EJS.
// 2. Serve /public as root.
// 3. Open path to src/views for res.render.
// 4. Auto-accept JSON if Content-Type: application/json is found.
// 5. Auto-accept query parameters.
// 6. Accept file upload routes.
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit.
    },
  }),
);

app.use(
  session({
    secret: "annguyen", // Thay thế bằng chuỗi bí mật của bạn
    resave: false, // Không lưu session nếu không thay đổi
    saveUninitialized: true, // Lưu session mới ngay cả khi không có dữ liệu
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Cookie có thời hạn 1 ngày
  }),
);

app.use("/", mainRouter);

// Catch all handler for error routes.
app.use((err, req, res, next) => {
  if (!err) next();
  console.log(err);
  res.render("layouts/main-layout", {
    title: "Internal Server Error",
    description:
      "Landing page for when a route produced an error, basically the server's fault and not the user's.",
    categories: null,
    content: "../pages/500",
    message: err,
  });
});

export default app;

app.use("/postlist", mainRouter);
app.use("/createpost", mainRouter);

app.get("/profile", async (req, res) => {
  try {
    const categories = await getAllCategories();

    if (!req.session.userInfo) {
      return res.redirect("/login");
    }

    // Fetch fresh user data from database
    const user = await User.findById(req.session.userInfo.id);
    if (!user) {
      return res.redirect("/login");
    }

    res.render("layouts/main-layout", {
      title: "Profile Settings",
      description: "Update your profile information",
      content: "../pages/profile",
      categories,
      userInfo: {
        ...req.session.userInfo,
        fullName: user.fullName,
        dob: user.dob,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).render("layouts/main-layout", {
      title: "Error",
      description: "Internal server error",
      content: "../pages/500",
      categories: [],
      message: "Error loading profile",
    });
  }
});
