const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketIo = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

// Connect Database
connectDB();

// Import routes
const authRoute = require('./routes/auth');
const itemsRoute = require('./routes/items');
const usersRoute = require('./routes/users');
const assistancesRoute = require('./routes/assistances');
const dashboardsRoute = require('./routes/dashboards');
const tasksRoute = require('./routes/tasks');
const inventoriesRoute = require('./routes/inventories');
const contactsRoute = require('./routes/contacts');
const reportRoute = require('./routes/report');
const Message = require('./models/Message');

// Init Middleware
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:5000'
        ],
    }),
);

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Donation System API Server is running!');
});

// Define Routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/items', itemsRoute);
app.use('/api/assistances', assistancesRoute);
app.use('/api/dashboards', dashboardsRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/inventories', inventoriesRoute);
app.use('/api/contacts', contactsRoute);
app.use('/api/report', reportRoute);

const server = http.createServer(app);
// Set up Socket.io with proper CORS handling
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5000'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.room = room;
        socket.join(room);
    });

    socket.on('chatMessage', async (msg) => {
        const newMessage = new Message({
            content: msg.text,
            sender: msg.sender,
            receiver: msg.receiver,
            contact: msg.contact,
        });

        const newMsg = await newMessage.save();
        const msg1 = await Message.aggregate([
            {
                $match: { _id: newMsg._id},
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
            }
        ]);
        io.emit('message', msg1[0]);
        // const notification = new Notification({
        //     sender: msg.sender,
        //     receiver: msg.receiver,
        //     content: "You have new message!",
        //     read: false,
        //     type: 'message'
        // });
        // await notification.save()
    });

    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chat');
    });
});

server.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);