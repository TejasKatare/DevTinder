const express = require('express');
const { model } = require('mongoose');
const Connection = require('../models/connection.js');
const { auth } = require('../middlewares/userAuth.js');
const { User } = require('../models/user.js');
const userRouter = express.Router();

const USER_SAFE_DATA = "_id firstName lastName photoUrl age gender skills";
userRouter.get('/request/received', auth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const dbData = await Connection.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        const data = dbData.map((row) => {
            return {_id: row._id, user: row.fromUserId};
        });
        res.json({data});
    }
    catch(err){
        res.status(500).send("Error: " + err.message);
    };
});

userRouter.get('/connections', auth, async (req, res) => {
    try{

        const loggedInUser = req.user;
        const dbData = await Connection.find().or(
            [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        )
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = dbData.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id))
                return row.toUserId;
            return row.fromUserId;
        });

        res.json({data});
    }
    catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

userRouter.get('/feed', auth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const userId = loggedInUser._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50: limit;
        const dbData = await Connection.find({
            $or:
            [
                {fromUserId: userId},
                {toUserId: userId}
            ]
        });
        const st = new Set();
        for (const row of dbData){
            st.add(row.fromUserId.toString());
            st.add(row.toUserId.toString());
        }
        st.add(userId);
        let docSkip = (page - 1) * limit;
        const data = await User.find({
            _id: {$nin: Array.from(st)}
        }).select(USER_SAFE_DATA).skip(docSkip).limit(limit);
        res.json({data});
    }
    catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = { userRouter };