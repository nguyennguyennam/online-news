const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    dateofBirth: Date,
    email: String,
    role: String,
    category: [{ type: String }] // Mảng chuỗi cho category
});

const Admin = mongoose.model("admin", adminSchema, "admin");

module.exports = Admin;