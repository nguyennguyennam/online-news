import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mainRouter from "./routes/index.js"; // Import router từ thư mục routing
import session from "express-session"
import dbConnection from "./config/mongoose.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views", "pages"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use (
    session({
        secret: "annguyen", // Thay thế bằng chuỗi bí mật của bạn
        resave: false, // Không lưu session nếu không thay đổi
        saveUninitialized: true, // Lưu session mới ngay cả khi không có dữ liệu
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Cookie có thời hạn 1 ngày
    })
)
// Đăng ký các route
app.use("/", mainRouter);

const PORT = process.env.PORT; // Cổng chạy ứng dụng, mặc định là 3000
dbConnection();

// Lệnh listen để khởi động server
app.listen(PORT, async () => {
  console.log("server started");
});
