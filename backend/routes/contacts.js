const Contact = require('../models/Contact');
const Message = require('../models/Message');
const verifyToken = require('../utils/verifyToken');
const { ObjectId } = require('mongodb');
const router = require('express').Router();

router.get('/', verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    try {
        const userId = req.user._id;
        
        const aggregation = [
            {
                $match: {
                    $or: [{ client: new ObjectId(userId) }, { admin: new ObjectId(userId) }]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'admin',
                    foreignField: '_id',
                    as: 'admin'
                }
            },
            { $unwind: '$client' },
            { $unwind: '$admin' },
            {
                $lookup: {
                    from: 'messages',
                    let: { contactId: '$_id', userId: new ObjectId(userId) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$contact', '$$contactId'] },
                                        {
                                            $or: [
                                                { $eq: ['$sender', '$$userId'] },
                                                { $eq: ['$receiver', '$$userId'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'lastMessage'
                }
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ['$lastMessage', 0] }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { contactId: '$_id', userId: new ObjectId(userId) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$contact', '$$contactId'] },
                                        { $eq: ['$receiver', '$$userId'] },
                                        { $eq: ['$read', false] }
                                    ]
                                }
                            }
                        },
                        { $count: 'unreadCount' }
                    ],
                    as: 'unreadCountInfo'
                }
            },
            {
                $addFields: {
                    unreadCount: {
                        $ifNull: [{ $arrayElemAt: ['$unreadCountInfo.unreadCount', 0] }, 0]
                    }
                }
            },
            {
                $project: {
                    __v: 0,
                    'client.__v': 0,
                    'admin.__v': 0,
                    unreadCountInfo: 0 // Remove helper fields
                }
            }
        ];

        const contactsWithMessages = await Contact.aggregate(aggregation);

        return res.send({ status: 'success', contacts: contactsWithMessages });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
});


router.post('/create', verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    const { client } = req.body;
    const existedContact = await Contact.findOne({ admin: req.user._id, client: client});
    if (!existedContact) {
        const contact = new Contact({
            admin: req.user._id,
            client: client
        });
        try {
            const savedContact = await contact.save()
    
            return res.send({ contact: savedContact, message: 'Contact successfully created' });
        } catch (err) {
            return res.status(400).send(err);
        }
    } else {
        return res.send({ message: 'Already existed' });
    }
    
});

router.get('/selectChat', verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    const contactQuery = typeof req.query.contactId !== 'undefined' && req.query.contactId !== "null" ? { contact: new ObjectId(req.query.contactId) } : {};

    const chats = await Message.aggregate([
        {
            $match: {
                ...contactQuery
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'sender',
                foreignField: '_id',
                as: 'sender'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiver'
            }
        },
        {
            $lookup: {
                from: 'contacts',
                localField: 'contact',
                foreignField: '_id',
                as: 'contact'
            }
        },
        
    ])

    return res.status(200).send({ chats: chats })
});

router.put('/read/:contactId', verifyToken(["Admin", "Donor", "Needy", "Volunteer"]), async (req, res) => {
    const contactId = new ObjectId(req.params.contactId);
    const senderId = req.body.client ? new ObjectId(req.body.client) : new ObjectId(req.body.client);

    const filterQuery = {
        contact: contactId,
        $or: [
            { sender: senderId },
        ]
    };

    try {
        const updatedMessages = await Message.updateMany(
            filterQuery,
            { $set: { read: true } }
        );

        if (updatedMessages.nModified === 0) {
            return res.status(404).send({ message: 'No messages found for the provided contact and user' });
        }

        return res.send({ message: 'All messages marked as read successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports = router;