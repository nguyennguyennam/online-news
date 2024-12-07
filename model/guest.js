import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    name: {type: String, require: true},
    dateofBirth: {type: String, require: true},
    role: {type: String, require:true},
    email: {type: String, require: true}
});

const guest = mongoose.model("Guest", guestSchema, "guest");

export default guest;