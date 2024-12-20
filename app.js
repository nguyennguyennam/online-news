import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { getAllCategories } from "./queries/categories.query.js";
import mainRouter from "./routes/index.js";
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

function generateSlug(title) {
  return slugify(title, {
    lower: true, // Convert to lower case
    strict: true, // Strip special characters except replacement
    trim: true, // Trim leading/trailing replacement chars
  });
}

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

const tag = ["economics", "global", "market", "technology", "news"];

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;

  res.render("layouts/main-layout.ejs", {
    title: "Article",
    slug: slug,
    // category: category,
    // imageUrl: imageUrl,
    // datePublished: datePublished,
    content: `../articles/${slug}`,
    description: "Article",
  });
});

app.get("/tag/:tagName", async (req, res) => {
  const requestedTag = req.params.tagName;

  // TODO: Replace with actual DB query using articleController
  const articles = [
    {
      _id: "1",
      title: "Sample Article",
      slug: "sample-article",
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      category: "Tech",
      tags: [requestedTag, "news"],
      datePublished: new Date().toLocaleDateString(),
      abstract: "This is a sample article with this tag.",
      isPremium: false,
    },
  ];

  const categories = await getAllCategories();

  res.render("layouts/main-layout.ejs", {
    title: `#${requestedTag} Articles`,
    description: `Articles tagged with #${requestedTag}`,
    content: "../pages/tag-grid",
    tagName: requestedTag,
    articles: articles,
    categories: categories,
  });
});

app.get("category/:category/:subcategory", async (req, res) => {
  const categories = await getAllCategories();

  const categoryParam = req.params.category;
  const subcategoryParam = req.params.subcategory;

  const category = categories.find((cat) => cat.name === categoryParam);
  const subcategory = category?.subcategories.find(
    (sub) => sub.name === subcategoryParam,
  );

  if (!category || !subcategory) {
    return res.status(404).render("layouts/main-layout.ejs", {
      title: "404 - Not Found",
      description: "The requested subcategory does not exist",
      content: "../pages/404",
      categories: categories,
    });
  }

  // TODO: Replace with actual DB query
  const articles = [
    {
      _id: "1",
      title: "Sample Subcategory Article",
      slug: generateSlug("Sample Subcategory Article"),
      category: category.name,
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      datePublished: new Date().toLocaleDateString(),
      tags: ["sample", "test"],
      abstract: "This is a sample article in this subcategory",
      isPremium: true,
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `${subcategory.displayName} - ${category.displayName}`,
    description: `${subcategory.displayName} news in ${category.displayName}`,
    content: "../pages/category-grid",
    categoryName: category.displayName,
    articles: articles,
    categories: categories,
  });
});

app.use("/postlist", mainRouter);
app.use("/createpost", mainRouter);
