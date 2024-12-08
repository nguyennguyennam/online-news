import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  postedDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default Comment = mongoose.model("Comment", commentSchema, "comments");
