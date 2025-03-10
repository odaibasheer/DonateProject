const multer = require("multer");
const verifyToken = require("../utils/verifyToken");
const Assistance = require("../models/Assistance");
const router = require("express").Router();

// Set up multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "public/uploads/assistance-documents/"),
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueSuffix);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/", "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        
        if (allowedMimeTypes.some(mime => file.mimetype.startsWith(mime))) {
            cb(null, true);
        } else {
            cb(new Error("Only image, PDF, or Excel files are allowed!"));
        }
    },
});

// **GET /assistances** - View all assistance requests
router.get("/", verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    try {
        const assistances = await Assistance.find()
            .select("-__v")
            .populate({
                path: "createdBy",
                select: "username email role",
            });
        return res.status(200).send(assistances);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **GET /assistances/:id** - View specific assistance request
router.get("/:id", verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    try {
        const { id } = req.params;
        const assistance = await Assistance.findById(id).populate({
            path: "createdBy",
            select: "username email role",
        });

        if (!assistance) {
            return res.status(404).send({ status: "error", message: "Assistance request not found" });
        }

        return res.status(200).send(assistance);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **GET /assistances/my-items** - View assistance requests by the logged-in user
router.get("/my-items", verifyToken(["Admin", "Donor", "Needy"]), async (req, res) => {
    try {
        const assistances = await Assistance.find({ createdBy: req.user._id })
            .select("-__v")
            .populate({
                path: "createdBy",
                select: "username email role",
            });

        return res.status(200).send(assistances);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **POST /assistances/create** - Submit a new assistance request
router.post("/create", verifyToken(["Needy", "Donor"]), upload.single("supporting_document"), async (req, res) => {
    try {
        const { title, type, description } = req.body;
        const createdBy = req.user._id;
        let supportingDocument = null;

        if (req.file) {
            supportingDocument = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;
        }

        const newAssistance = new Assistance({
            title,
            type,
            description,
            createdBy,
            supporting_document: supportingDocument,
        });

        await newAssistance.save();
        return res.status(201).send({
            status: "success",
            message: "Assistance request created successfully",
            assistance: newAssistance,
        });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **PUT /assistances/update/:id** - Update an assistance request
router.put("/update/:id", verifyToken(["Needy", "Admin"]), upload.single("supporting_document"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, description } = req.body;

        const updatedData = {};
        if (title) updatedData.title = title;
        if (type) updatedData.type = type;
        if (description) updatedData.description = description;

        if (req.file) {
            updatedData.supporting_document = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;
        }

        const updatedAssistance = await Assistance.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedAssistance) {
            return res.status(404).send({ status: "error", message: "Assistance request not found" });
        }

        return res.status(200).send({
            status: "success",
            message: "Assistance request updated successfully",
            assistance: updatedAssistance,
        });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **DELETE /assistances/delete/:id** - Delete an assistance request
router.delete("/delete/:id", verifyToken(["Admin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAssistance = await Assistance.findByIdAndDelete(id);

        if (!deletedAssistance) {
            return res.status(404).send({ status: "error", message: "Assistance request not found" });
        }

        return res.status(200).send({ status: "success", message: "Assistance request deleted successfully" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.put("/update-status/:id", verifyToken(["Admin"]), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate request body
    if (!status || !["Pending", "Approved", "Declined"].includes(status)) {
        return res.status(400).send({ message: "Invalid status. Allowed values are 'Pending', 'Approved', or 'Declined'." });
    }

    try {
        // Update the status of the assistance
        const assistance = await Assistance.findOneAndUpdate(
            { _id: id },
            { status },
            { new: true } // Return the updated document
        );

        if (!assistance) {
            return res.status(404).send({ message: "Assistance not found." });
        }

        return res.status(200).send({
            message: "Status successfully changed!",
            updatedAssistance: assistance,
        });
    } catch (error) {
        console.error("Error updating assistance status:", error);
        return res.status(500).send({ message: "Server error occurred while changing the assistance status." });
    }
});

module.exports = router;
