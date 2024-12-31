import "dotenv/config";
import express from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import path from "path";
import { fileURLToPath } from "url";
import mainRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const store = createMemoryStore(session);

// 1. Setup view engine EJS.
// 2. Serve /public as root.
// 3. Open path to src/views for res.render.
// 4. Auto-accept JSON if Content-Type: application/json is found.
// 5. Auto-accept query parameters.
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
    store: new store(),
  }),
);

app.use("/", mainRouter);
export default app;

//Catch all handler for error routes.
app.use((err, req, res, next) => {
  console.log(err);
  res.render("layouts/main-layout", {
    title: "Internal Server Error",
    description:
      "Landing page for when a route produced an error, basically the server's fault and not the user's.",
    content: "../pages/500",
    message: err,
    userInfo: req.session?.userInfo,
  });
});
