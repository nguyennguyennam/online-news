import Writer from "../model/writer.js";

class WriterController {
    renderWriter = (req, res) => {
        res.render("writer");
    };

    // Check if writer ID exists
    findWriter = async (req, res) => {
        try {
            const writerID = req.query.id;

            if (!writerID) {
                return res.render("writer", { message: "fail" });
            }

            const writerInfo = await Writer.find({ _id: writerID });

            if (writerInfo.length === 0) {
                return res.render("writer", { message: "fail" });
            }

            res.render("writer", { message: "success", data: writerInfo });
        } catch (err) {
            console.error("Error while finding writer:", err);
            res.render("writer", { message: "fail" });
        }
    };

    // Edit writer information
    editWriter = async (req, res) => {
        try {
            const writerID = req.body._id;
            const updateWriterInfo = req.body;

            if (!writerID || !updateWriterInfo) {
                return res.render("writer", { message: "fail" });
            }

            const updatedWriter = await Writer.findByIdAndUpdate(
                writerID,
                { $set: updateWriterInfo },
                { new: true, runValidators: true }
            );

            if (!updatedWriter) {
                return res.render("writer", { message: "fail" });
            }

            res.render("writer", { message: "success", data: updatedWriter });
        } catch (err) {
            console.error("Error while editing writer:", err);
            res.render("writer", { message: "fail" });
        }
    };
}

export default new WriterController();
