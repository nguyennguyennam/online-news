import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    category: [{ type: String }] // Array of strings for category
});

const Admin = mongoose.model("Admin", adminSchema, "admin");

export default Admin;

