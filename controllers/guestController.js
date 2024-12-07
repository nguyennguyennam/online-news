import Guest from "../model/guest.js";

class GuestController {
    // Render the guest page
    renderGuest = (req, res) => {
        res.render("guest");
    };

    // Find guest by name, password, and role
    findGuest = async (req, res) => {
        try {
            const { name, password, role } = req.query;

            // Validate query parameters
            if (!name || !password || !role) {
                return res.render("guest", { message: "fail" });
            }

            // Find guest with matching criteria
            const guestInfo = await Guest.findOne({ name, password, role });

            if (!guestInfo) {
                return res.render("guest", { message: "fail" });
            }

            res.render("guest", { message: "success", data: guestInfo });
        } catch (e) {
            console.error("Error finding guest:", e);
            res.render("guest", { message: "fail" });
        }
    };

    // Edit guest information
    editGuest = async (req, res) => {
        try {
            const { id, name, password, dateOfBirth, email } = req.body;

            // Validate the request body
            if (!id || !name || !password || !dateOfBirth || !email) {
                return res.render("guest", { message: "fail" });
            }

            // Update the guest document
            const updatedGuest = await Guest.findByIdAndUpdate(
                id,
                {
                    name,
                    password,
                    dateOfBirth,
                    email,
                },
                { new: true, runValidators: true }
            );

            if (!updatedGuest) {
                return res.render("guest", { message: "fail" });
            }

            res.render("guest", { message: "success", data: updatedGuest });
        } catch (e) {
            console.error("Error editing guest:", e);
            res.render("guest", { message: "fail" });
        }
    };
}
export default new GuestController();
