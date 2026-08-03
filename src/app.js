require('dotenv').config();
const express = require('express');
const { authRouter } = require('./routes/auth.js'); 
const { profileRouter } = require('./routes/profile.js');
const { connectionRouter } = require('./routes/request.js');
const { userRouter } = require('./routes/user.js');
const { testRouter } = require('./routes/test.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dns = require("dns");
const { connectDB } = require('./config/database.js');
const app = express();
const port = process.env.PORT;
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(cors(
    {
        origin: process.env.Frontend_URL,
        credentials: true,
    }
));
console.log("APP STARTED");
app.use(express.json());
app.use(cookieParser());
app.use('/', testRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', connectionRouter);
app.use('/user', userRouter);

connectDB()
    .then(() => {
        console.log("Connected to the database successfully");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });

