const express = require('express');
const verifyToken = require('../utils/verifyToken');
const Item = require('../models/Item');
const router = express.Router();

// Endpoint to get total quantity for each item type
router.get('/', verifyToken(['Admin']), async (req, res) => {
    try {
        const summary = await Item.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $project: {
                    _id: 0,
                    type: '$_id',
                    totalQuantity: 1,
                },
            },
        ]);

        return res.status(200).json(summary);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/items', verifyToken(['Admin']), async (req, res) => {
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


module.exports = router;
