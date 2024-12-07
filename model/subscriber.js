import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    name: {type: String, require: true},
    dateofBirth: {type: String, require: true},
    role: {type: String, require:true},
    email: {type: String, require: true},
    date_sign_in_Premium: {type: Date, require: true},
    out_of_date_Premium: {type: Date, require:true},
    extend: {type: Boolean, require: true}, 
});

const subscribe = mongoose.model("subscribe", subscriberSchema, "subscribe");

export default subscribe;