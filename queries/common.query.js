import userModel from "../model/user.model.js";

export async function saved_user (fullName, dob, password, email) {
    let clearance = 1;
    let subscription = Date.now();
    let expiry_date = subscription + 24*60*60*7;
    const otpExpiration = null;
    return await userModel.create({
        fullName, dob, email, password, clearance, subscription, expiry_date, otpExpiration
    }) }



