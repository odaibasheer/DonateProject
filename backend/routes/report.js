const express = require('express');
const verifyToken = require('../utils/verifyToken');
const Item = require('../models/Item');
const Assistance = require('../models/Assistance');
const Task = require('../models/Task');
const router = express.Router();

// Admin Route: Fetch Transparency & Reporting Data
router.get('/admin', verifyToken(['Admin']), async (req, res) => {
    try {
        const totalReceivedDonations = await Item.countDocuments();
        const totalDistributedDonations = await Task.countDocuments({ status: 'Delivered' });

        const donationsByType = await Item.aggregate([
            { $group: { _id: '$type', totalDonations: { $sum: 1 } } }
        ]);

        const assistanceByStatus = await Assistance.aggregate([
            { $group: { _id: '$status', totalAssistances: { $sum: 1 } } }
        ]);

        const volunteerTaskStats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    totalVolunteerTasks: { $sum: 1 },
                },
            },
        ]);

        const formattedDonationsByType = donationsByType.map((item) => ({
            type: item._id,
            totalDonations: item.totalDonations,
        }));

        const formattedAssistanceByStatus = assistanceByStatus.map((item) => ({
            status: item._id,
            totalAssistances: item.totalAssistances,
        }));

        const formattedVolunteerTaskStats = volunteerTaskStats.map((item) => ({
            status: item._id,
            totalVolunteerTasks: item.totalVolunteerTasks,
        }));

        return res.send({
            totalReceivedDonations,
            totalDistributedDonations,
            donationsByType: formattedDonationsByType,
            assistanceByStatus: formattedAssistanceByStatus,
            volunteerTaskStats: formattedVolunteerTaskStats,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports = router;
