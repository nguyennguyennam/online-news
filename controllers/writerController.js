const Writer = require("../model/writer");

class writerController {
    renderWriter = (req, res) => {
        res.render("writer");
    }
    // insertWriter = async (req, res) => {
    //     try {
    //         const writer_data = req.body;
    //         console.log("Raw fetched data:", writer);
    //         if (!writer_data || writer_data.length === 0) {
    //             res.status(500).json("No data was found!");
    //         }
    //         const writer_inserted = await this.Writer.insertMany(writer_data)
    //         if (writer_inserted.length === 0) {
    //             res.status(404).json({ message: `Insert data unsuccessfully` });
    //         }
    //         else {
    //             res.status(200).json({ message: "Inserted writer succesfully", data: writer_inserted });
    //         }
    //     }
    //     catch (err) {
    //         res.status(500).json({ message: `Error while inserting data ${err}` });
    //     }
    // }
    //Check if writer ID exists
    findWriter = async (req, res) => {
        try {
            const writerID = req.query.id;
            if (!writerID || writerID.length === 0) {
                const required_message = res.status(400).json({ message: "WriterID is required" });
                res.render('writer', required_message);
            }
            const writer_info = await this.Writer.findAll({ _id: writerID });
            if (writer_info.length === 0) {
                res.status(404).json({ message: "No writer is found" });
            }
            res.status(200).json({
                message: `Find writer successfully`,
                data: writer_info
            });
            res.render("writer", { writer_info });
        }
        catch (err) {
            res.status(500).json({ message: `Error while finding writer: ${err}` })
        }
    }
    editWriter = async (req, res) => {
        try {
            const writer_id = req.body._id;
            const update_writer_info = req.body;
            if (!update_writer_info || update_writer_info.length === 0) {
                const no_data_message = res.status(400).json({ message: `No data was found!` });
                res.render('writer', no_data_message);
            }
            const edit_writer = await this.Writer.findByIdAndUpdate(
                writer_id,
                { $set: update_writer_info },
                { new: true, runValidators: true }
            );
            if (!edit_writer) {
                const fail_edit_massage = res.status(404).json({ message: "Error while editing data" });
                res.render('writer', fail_edit_massage);
            }
            const success_insert = res.status(200).json({ message: "Edit succesfully" });
            res.render('writer', success_insert);
        }
        catch (err) {
            const err_insert = res.status(500).json({ message: `Error while editing data: ${err}` });
            res.render('writer', err_insert);
        }
    }
}

module.exports = new writerController;