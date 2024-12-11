import editorModel from "../model/editor.model";
import userModel from "../model/user.model";
import categoryModel from "../model/category.model";
// Get All Cat : Please look at categories.query.js
// Some of the CRUD functions with category and tag are in categories.query.js file


// Manage users

export async function get_Users() {
    return await userModel.aggregate([
        // Nhóm theo clearance
        {
            $group: {
                _id: "$clearance", // Nhóm theo clearance
                users: {
                    $push: {
                        name: "$name",
                        dob: "$dob",
                        email: "$email",
                    },
                },
            },
        },
        // Tùy chọn: Đổi tên _id thành clearance trong kết quả
        {
            $project: {
                _id: 0,
                clearance: "$_id",
                users: 1,
            },
        },
    ]);
}

export async function cat_by_Editors(id_editor, cat_lists) {
    const categories = await categoryModel.find(
        { name: { $in: cat_lists } },
        { _id: 1 }
    );

    const cat_Ids = categories.map(category => category._id);

    return await editorModel.findByIdAndUpdate(
        id_editor,
        { authorizedCategories: cat_Ids },
        { new: true }
    )
}

export async function expire_subs() {
    const current_date = Date.now();
    return await userModel.find(
        {
            clearance: 1,
            expireDate: { $lte: current_date }
        },

        {
            fullName:1,
            password: 1,
            dob: 1,
            _id: 0,
        }
    )
}

export async function subscriber_extend(id_subs) {
    const current_date = Date.now();
    return await userModel.findByIdAndUpdate(
        id_subs,
        {subscription: current_date,
         expireDate: current_date + 7 * 24 * 60 * 60 * 1000
         },
        {new: true}
    )
}