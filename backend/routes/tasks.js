const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

// Get all tasks with authorization
router.get('/', verifyToken(['Admin', 'Donor', 'Needy', 'Volunteer']), async (req, res) => {
    try {
        const tasks = await Task.find()
            .select('-__v')
            .populate({
                path: 'assign',
                select: 'username email role',
            });

        return res.status(200).send({
            status: "success",
            tasks,
        });
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
        const { type, location, assign, status } = req.body;

        const updatedData = {};
        if (type) updatedData.type = type;
        if (location) updatedData.location = location;
        if (assign) updatedData.assign = assign;
        if (status) updatedData.status = status;

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

module.exports = router;