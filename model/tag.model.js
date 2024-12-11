import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  },
});

export default mongoose.model("tag", tagSchema, "tags");
