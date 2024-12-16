import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mainRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
export default app;

const tag = ["economics", "global", "market", "technology", "news"];

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// Đăng ký các route
app.use("/", mainRouter);

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

app.get("/search", (req, res) => {
  const searchQuery = req.query.query;

  // TODO: Replace with actual DB query using articleController
  const articles = [
    {
      _id: "1",
      title: "Sample Article",
      slug: "sample-article",
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      category: "Tech",
      tags: ["technology", "news"],
      datePublished: new Date().toLocaleDateString(),
      abstract: "This is a sample article with this tag.",
      isPremium: true,
    },
    {
      _id: "1",
      title: "Sample Article",
      slug: "sample-article",
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      category: "Tech",
      tags: ["technology", "news"],
      datePublished: new Date().toLocaleDateString(),
      abstract: "This is a sample article with this tag.",
      isPremium: false,
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `Search Results for "${searchQuery}"`,
    description: "Search results page",
    content: "../pages/search",
    searchQuery: searchQuery,
    articles: articles,
  });
});

app.get("/tag/:tagName", (req, res) => {
  const requestedTag = req.params.tagName;

  // Check if tag exists in predefined tag list
  if (!tag.includes(requestedTag)) {
    return res.status(404).render("layouts/main-layout.ejs", {
      title: "404 - Not Found",
      description: "The requested tag does not exist",
      content: "../pages/404",
    });
  }

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

  res.render("layouts/main-layout.ejs", {
    title: `#${requestedTag} Articles`,
    description: `Articles tagged with #${requestedTag}`,
    content: "../pages/tag-grid",
    tagName: requestedTag,
    articles: articles,
  });
});

app.get("/:category", (req, res) => {
  const categoryParam = req.params.category;
  const category = categories.find((cat) => cat.name === categoryParam);

  // Check if category exists
  if (!category) {
    return res.status(404).render("layouts/main-layout.ejs", {
      title: "404 - Not Found",
      description: "The requested category does not exist",
      content: "../pages/404",
    });
  }

  // Fetch articles for this category from database
  // TODO: Replace with actual DB query using articleController
  const articles = [
    {
      _id: "1",
      title: "Sample Article",
      slug: "sample-article",
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      category: category.name,
      tags: ["technology", "news"],
      datePublished: new Date().toLocaleDateString(),
      abstract: "This is a sample article in this category.",
      isPremium: false,
    },
    {
      _id: "1",
      title: "Sample Article",
      slug: "sample-article",
      imageUrl: "https://placehold.co/600x400/EEE/31343C",
      category: category.name,
      tags: ["technology", "news"],
      datePublished: new Date().toLocaleDateString(),
      abstract: "This is a sample article in this category.",
      isPremium: true,
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `${category.displayName} News`,
    description: `Latest ${category.displayName} news and updates`,
    content: "../pages/category-grid",
    categoryName: category.displayName,
    articles: articles,
  });
});

app.get("/:category/:subcategory", (req, res) => {
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
