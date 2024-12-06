    const mongoose = require("mongoose");
    require("dotenv").config();

    const mongo_url = process.env.MONGODB_URL;
    const dbConnection = async () => {
        try {
            if (!mongo_url) {
                throw new Error ("Invalid mongoURL");
            }
            const connection = await mongoose.connect(mongo_url, {
            });
            console.log(`MongoDB connected: ${connection.connection.host}`); // Corrected template literal
        }
        catch(err) {
            console.log(err);
        }
    }
    module.exports = dbConnection;