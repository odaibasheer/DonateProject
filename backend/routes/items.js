const multer = require("multer");
const Item = require("../models/Item");
const verifyToken = require("../utils/verifyToken");

const router = require('express').Router();

// Set up multer for image uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "public/uploads/donation-items/"),
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueSuffix);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

// **GET /donations** - View all donation history
router.get('/', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    try {
        const items = await Item.find()
            .select('-__v')
            .populate({
                path: 'createdBy',
                select: 'username email role'
            });
        return res.status(200).send(items);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.get('/getOneItem/:id', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id)
            .populate({
                path: 'createdBy',
                select: 'username email role',
            });

        if (!item) {
            return res.status(404).send({ status: "error", message: "Donation item not found" });
        }

        return res.status(200).send(item);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.get('/my-items', verifyToken(['Admin', 'Donor']), async (req, res) => {
    try {
        const items = await Item.find({ createdBy: req.user._id })
            .select('-__v')
            .populate({
                path: 'createdBy',
                select: 'username email role',
            });

        return res.status(200).send(items);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **POST /donations** - Submit a new donation
router.post('/create', verifyToken(['Admin', 'Donor']), upload.single('image'), async (req, res) => {
    try {
        const { type, amount, description, purpose } = req.body;
        const createdBy = req.user._id;  // Assuming the user is attached to the req object
        let image = null;

        // Handle image upload
        if (req.file) {
            image = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, '/').replace('public/', '')}`;
        }

        const newItem = new Item({
            type,
            amount,
            description,
            createdBy,
            image,
            purpose,
        });

        await newItem.save();
        return res.status(201).send({ status: "success", message: "Donation added successfully", item: newItem });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **PUT /donations/:id** - Update an existing donation
router.put('/update/:id', verifyToken(['Admin', 'Donor']), upload.single('image'), async (req, res) => {
    try {
        const { type, amount, description, purpose } = req.body;
        console.log(req.body)
        const { id } = req.params;

        const updatedData = {};
        if (type) updatedData.type = type;
        if (amount) updatedData.amount = amount;
        if (description) updatedData.description = description;
        if (purpose) updatedData.purpose = purpose;

        // Handle image upload
        if (req.file) {
            updatedData.image = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
        }
        
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updatedData,
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).send({ status: "error", message: "Donation not found" });
        }

        return res.status(200).send({ status: "success", message: "Donation updated successfully", item: updatedItem });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// **DELETE /donations/:id** - Delete a donation
router.delete('/delete/:id', verifyToken(['Admin', 'Donor']), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).send({ status: "error", message: "Donation not found" });
        }

        return res.status(200).send({ status: "success", message: "Donation deleted successfully" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

module.exports = router;
