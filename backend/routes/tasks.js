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
        const { type, location, assign, status, urgency } = req.body;

        const newTask = new Task({
            type,
            location: location.formatted_address,
            assign,
            status,
            urgency,
        });

        const savedTask = await newTask.save();

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
        const { type, location, assign, status, urgency } = req.body;

        const updatedData = {};
        if (type) updatedData.type = type;
        if (location) updatedData.location = location;
        if (assign) updatedData.assign = assign;
        if (status) updatedData.status = status;
        if (urgency) updatedData.urgency = urgency;

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

module.exports = router;