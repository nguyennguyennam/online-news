import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dob: Date,
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  clearance: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  subscription: Date,
});

export const User = mongoose.model("User", userSchema, "users");
