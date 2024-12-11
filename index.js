import slugify from "slugify";
import app from "./app.js";

function generateSlug(title) {
  return slugify(title, {
    lower: true, // Convert to lower case
    strict: true, // Strip special characters except replacement
    trim: true, // Trim leading/trailing replacement chars
  });
}

const categories = [
  {
    name: "economics",
    displayName: "Economics",
    subcategories: [
      { name: "us", displayName: "US", link: "/economics/us" },
      { name: "europe", displayName: "Europe", link: "/economics/europe" },
    ],
  },
  {
    name: "education",
    displayName: "Education",
    subcategories: [
      { name: "europe", displayName: "Europe", link: "/education/europe" },
    ],
  },
  {
    name: "film",
    displayName: "Film",
    subcategories: [
      { name: "interview", displayName: "Interview", link: "/film/interview" },
      { name: "review", displayName: "Review", link: "/film/review" },
    ],
  },
  {
    name: "game",
    displayName: "Game",
    subcategories: [
      { name: "console", displayName: "Game console", link: "/game/console" },
      { name: "pc", displayName: "Game PC", link: "/game/pc" },
      { name: "mobile", displayName: "Game mobile", link: "/game/mobile" },
    ],
  },
  {
    name: "law",
    displayName: "Law",
    subcategories: [{ name: "us", displayName: "US", link: "/law/us" }],
  },
  {
    name: "music",
    displayName: "Music",
    subcategories: [
      { name: "us", displayName: "US", link: "/music/us" },
      { name: "uk", displayName: "UK", link: "/music/uk" },
    ],
  },
  {
    name: "politics",
    displayName: "Politics",
    subcategories: [
      { name: "europe", displayName: "Europe", link: "/politics/europe" },
      { name: "asia", displayName: "Asia", link: "/politics/asia" },
      { name: "us", displayName: "US", link: "/politics/us" },
    ],
  },
  {
    name: "sport",
    displayName: "Sport",
    subcategories: [
      { name: "football", displayName: "Football", link: "/sport/football" },
      { name: "tennis", displayName: "Tennis", link: "/sport/tennis" },
    ],
  },
  {
    name: "tech",
    displayName: "Tech",
    subcategories: [
      { name: "phone", displayName: "Phone Review", link: "/tech/phone" },
      { name: "gadget", displayName: "Garget Review", link: "/tech/gadget" },
    ],
  },
  {
    name: "travel",
    displayName: "Travel",
    subcategories: [
      { name: "europe", displayName: "Europe", link: "/travel/europe" },
      { name: "asia", displayName: "Asia", link: "/travel/asia" },
      { name: "us", displayName: "US", link: "/travel/us" },
    ],
  },
];

const tag = ["economics", "global", "market", "technology", "news"];

app.use((req, res, next) => {
  // Add categories to res.locals so it's available in all views
  res.locals.categories = categories;
  next();
});

app.get("/search", (req, res) => {
  const searchQuery = req.query.query;
  res.render("layouts/main-layout.ejs", {
    title: `Search Results for "${searchQuery}"`,
    description: "Search results page",
    content: "../pages/search",
    searchQuery: searchQuery,
    activeCategory: "home",
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
      activeCategory: "home",
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
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `#${requestedTag} Articles`,
    description: `Articles tagged with #${requestedTag}`,
    content: "../pages/tag-grid",
    tagName: requestedTag,
    articles: articles,
    activeCategory: "home",
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
      activeCategory: "home",
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
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `${category.displayName} News`,
    description: `Latest ${category.displayName} news and updates`,
    content: "../pages/category-grid",
    activeCategory: category.name,
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
      activeCategory: categoryParam,
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
    },
  ];

  res.render("layouts/main-layout.ejs", {
    title: `${subcategory.displayName} - ${category.displayName}`,
    description: `${subcategory.displayName} news in ${category.displayName}`,
    content: "../pages/category-grid",
    activeCategory: category.name,
    activeSubcategory: subcategory.name,
    categoryName: category.displayName,
    articles: articles,
    categories: categories,
  });
});

app.listen(3000, () => {
  console.log("server started");
});
