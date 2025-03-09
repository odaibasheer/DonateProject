const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../utils/verifyToken');
const Assistance = require('../models/Assistance');
const Item = require('../models/Item');
const router = express.Router();

// Get all tasks with authorization
router.get('/', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    try {
        const tasks = await Task.find()
            .select('-__v')
            .populate({
                path: 'assign',
                select: 'username email role',
            })
            .populate({
                path: 'assistance',
            })
            .populate({
                path: 'donation',
            });

        return res.status(200).send(tasks);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

// volunteer tasks
router.get('/volunteers', verifyToken(['Volunteer']), async (req, res) => {
    try {
        const tasks = await Task.find({ assign: req.user._id })
            .select('-__v')
            .populate({
                path: 'assign',
                select: 'username email role',
            })
            .populate({
                path: 'assistance',
            })
            .populate({
                path: 'donation',
            });

        return res.status(200).send(tasks);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

// Create a new task
router.post('/create', verifyToken(['Admin', 'Volunteer']), async (req, res) => {
    try {
        const { title, type, location, assign, status, urgency, assistance, donation, quantity } = req.body;

        // Fetch the donation item to check its quantity
        const itemOne = await Item.findById(donation);
        if (!itemOne) {
            return res.status(404).send({
                status: "error",
                message: "Donation item not found.",
            });
        }

        // Validate the requested quantity
        if (quantity > itemOne.quantity) {
            return res.status(400).send({
                status: "error",
                message: `Insufficient quantity available. Maximum available quantity is ${itemOne.quantity}.`,
            });
        }

        // Create the new task
        const newTask = new Task({
            title,
            type,
            location: location.formatted_address,
            assign,
            status,
            assistance,
            donation,
            urgency,
            quantity,
        });

        const savedTask = await newTask.save();

        // Update the quantity of the donation item
        const updatedData = { quantity: itemOne.quantity - quantity };
        await Item.findByIdAndUpdate(donation, updatedData, {
            new: true,
            runValidators: true,
        });

        return res.status(201).send({
            status: "success",
            message: "Task created successfully",
            task: savedTask,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});


// Get a single task by ID
router.get('/getOneTask/:id', verifyToken(['Admin', 'Volunteer']), async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .select('-__v')
            .populate({
                path: 'assign',
                select: 'username email role',
            })
            .populate({
                path: 'assistance',
                // select: 'type',
            })
            .populate({
                path: 'donation',
            });

        if (!task) {
            return res.status(404).send({
                status: "error",
                message: "Task not found",
            });
        }

        return res.status(200).send(task);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});


// Update a task by ID with authorization
router.put('/update/:id', verifyToken(['Volunteer', 'Admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, location, assign, status, urgency, assistance, donation, quantity } = req.body;
        const updatedData = {};

        if (title) updatedData.title = title;
        if (type) updatedData.type = type;
        
        // Check if location is an object or string
        if (location) {
            if (typeof location === 'object' && location.formatted_address) {
                updatedData.location = location.formatted_address; // If it's an object, use the formatted_address
            } else if (typeof location === 'string') {
                updatedData.location = location; // If it's a string, just assign it
            }
        }

        if (assign) updatedData.assign = assign;
        if (assistance) updatedData.assistance = assistance;
        if (donation) updatedData.donation = donation;
        if (status) updatedData.status = status;
        if (urgency) updatedData.urgency = urgency;
        if (quantity) updatedData.quantity = quantity;

        const updatedTask = await Task.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            return res.status(404).send({
                status: "error",
                message: "Task not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});


// Delete a task by ID
router.delete('/delete/:id', verifyToken(['Admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).send({
                status: "error",
                message: "Task not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Task deleted successfully",
            task: deletedTask,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/getAssistances", verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    try {
        const assistances = await Assistance.find({ status: "Approved" })
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

router.get("/getEnableItems", verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    try {
        const items = await Item.find({ quantity: { $gt: 0 } })
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


module.exports = router;