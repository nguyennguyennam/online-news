import app from "./app.js";

const PORT = process.env.PORT; // Cổng chạy ứng dụng, mặc định là 3000
dbConnection();

// Lệnh listen để khởi động server
app.listen(PORT, async () => {
  console.log("server started");
});
