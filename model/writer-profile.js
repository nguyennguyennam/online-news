import mongoose from "mongoose";

const writerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  penName: String,
  posts: {
    draft: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    approved: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    published: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    denied: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
  },
});

export default WriterProfile = mongoose.model(
  "WriterProfile",
  writerProfileSchema,
  "writerprofiles",
);
