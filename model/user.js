import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema, "users");
