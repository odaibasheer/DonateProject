const express = require('express');
const verifyToken = require('../utils/verifyToken');
const Item = require('../models/Item');
const Assistance = require('../models/Assistance');
const router = express.Router();

router.get('/admin', verifyToken(['Admin']), async (req, res) => {
    try {
        const totalDonation = await Item.countDocuments();
        const pendingCount = await Assistance.countDocuments({ status: 'Pending' });
        const approvedCount = await Assistance.countDocuments({ status: 'Approved' });
        const declinedCount = await Assistance.countDocuments({ status: 'Declined' });

        // Get daily requests
        const dailyRequests = await Assistance.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date
        ]);

        // Get monthly requests
        const monthlyRequests = await Assistance.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }, // Sort by month
        ]);

        // Transform data for the frontend
        const dailyRequestsFormatted = dailyRequests.map((item) => ({
            date: item._id,
            count: item.count,
        }));

        const monthlyRequestsFormatted = monthlyRequests.map((item) => ({
            month: item._id,
            count: item.count,
        }));

        return res.send({
            pending: pendingCount,
            approved: approvedCount,
            declined: declinedCount,
            dailyRequests: dailyRequestsFormatted,
            monthlyRequests: monthlyRequestsFormatted,
        });
    } catch (error) {
        console.error('Error fetching assistance statistics:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports = router;