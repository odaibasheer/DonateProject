const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

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

app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);