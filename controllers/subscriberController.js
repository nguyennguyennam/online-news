import subscribe from "../model/subscriber";


module.exports =  class subscriberController {
    renderSubscribe (req, res) {
        res.render ("subscriber");
    }

    // Find guest by name, password, and role
    findSubscriber = async (req, res) => {
        try {
            const { name, password, role } = req.query;

            // Validate query parameters
            if (!name || !password || !role) {
                return res.render("subscriber", { message: "fail" });
            }

            // Find guest with matching criteria
            const subscriber_info = await subscribe.findOne({ name, password, role });

            if (!subscriber_info) {
                return res.render("subscriber", { message: "fail" });
            }

            res.render("subscriber", { message: "success", data: subscriber_info });
        } catch (e) {
            console.error("Error finding guest:", e);
            res.render("subscriber_info", { message: "fail" });
        }
    };

    // Edit guest information
    editSubscriber = async (req, res) => {
        try {
            const { id, name, password, dateOfBirth, email } = req.body;

            // Validate the request body
            if (!id || !name || !password || !dateOfBirth || !email) {
                return res.render("subscriber", { message: "fail" });
            }

            // Update the guest document
            const updated_Subscriber = await subscribe.findByIdAndUpdate(
                id,
                {
                    name,
                    password,
                    dateOfBirth,
                    email,
                },
                { new: true, runValidators: true }
            );

            if (!updated_Subscriber) {
                return res.render("subscriber", { message: "fail" });
            }

            res.render("subscriber", { message: "success", data: updatedGuest });
        } catch (e) {
            console.error("Error editing guest:", e);
            res.render("subscriber", { message: "fail" });
        }
    };

    checkRemaining_time = async (req, res) => {
        try {
            const currentDate = new Date();
    
            // Find and update subscriptions where the premium expiry date is today or earlier
            const expiredSubscription = await subscribe.findOneAndUpdate(
                { out_of_date_Premium: { $lte: currentDate } }, // Check expiry date
                { $set: { extend: false } }, // Update extend field to false
                { new: true } // Return the updated document
            );
    
            if (expiredSubscription) {
                // Render the "out_of_date" message if an expired subscription is found
                return res.render("subscriber", { message: "out_of_date", data: expiredSubscription });
            }
    
            // If no expired subscriptions are found, render the "active" message
            res.render("subscriber", { message: "active" });
        } catch (e) {
            console.error("Error checking premium status:", e);
            res.render("subscriber", { message: "fail" });
        }
    };
    
    //Update premium
    updatePremium = async (req, res) => {
        try {
            const { id, action } = req.body; // Retrieve the subscriber ID and action from the form submission
    
            if (!id || !action || action !== "Extend") {
                return res.render("subscriber", { message: "fail" });
            }
    
            // Extend the subscription by 7 days
            const currentDate = new Date();
            const newExpiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
    
            const updatedSubscriber = await subscribe.findByIdAndUpdate(
                id,
                {
                    date_sign_in_Premium: currentDate,
                    out_of_date_Premium: newExpiryDate,
                    extend: true,
                },
                { new: true, runValidators: true } // Return the updated document
            );
    
            if (!updatedSubscriber) {
                return res.render("subscriber", { message: "fail" });
            }
    
            // Render success with updated data
            res.render("subscriber", { message: "success", data: updatedSubscriber });
        } catch (e) {
            console.error("Error updating premium subscription:", e);
            res.render("subscriber", { message: "fail" });
        }
    };    
}

