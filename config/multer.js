import multer from "multer";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(32).toString("hex");
    cb(null, uniqueSuffix + file.filename);
  },
});

const upload = multer({ storage: storage });

export { upload };
