import userModel from "../model/user.model.js";

export async function saved_user(fullName, dob, password, email, role) {
  let clearance;
  let subscription = null; // Khởi tạo mặc định
  let expiry_date = null; // Khởi tạo mặc định
  switch (role) {
    case "subscriber":
      clearance = 1;
      subscription = new Date(); // Ngày bắt đầu
      expiry_date = new Date(
        subscriptionDate.getTime() + 7 * 24 * 60 * 60 * 1000,
      ); // Cộng 7 ngày
      break;
    case "writer":
      clearance = 2;
      subscription = null;
      expiry_date = null;
      break;
    case "editor":
      clearance = 3;
      subscription = null;
      expiry_date = null;
      break;
    case "admin":
      clearance = 4;
      subscription = null;
      expiry_date = null;
      break;
    default:
      throw new Error(
        "Invalid role. Allowed roles: subscriber, writer, editor, admin.",
      );
  }
  const otpExpiration = null;
  return await userModel.create({
    fullName,
    dob,
    email,
    password,
    clearance,
    subscription,
    expiry_date,
    otpExpiration,
  });
}

export async function get_user(name, password) {
  return await userModel.findOne(
    {
      name: name,
    },
    {
      password: password,
    },
  );
}
