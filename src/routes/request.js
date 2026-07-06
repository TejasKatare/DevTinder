const express = require('express');
const Connection = require('../models/connection.js');
const { auth } = require('../middlewares/userAuth.js');
const { User } = require('../models/user.js');
const connectionRouter = express.Router();

connectionRouter.post('/send/:status/:toUserId', auth, async (req, res) => {
    try{
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;

        //validate status
        if(status !== "ignored" && status !== "interested")
            throw new Error("Invalid status");

        //valid toUserId
        const touser = await User.findById(toUserId);
        if(!touser)
            throw new Error("User not found");

        //validate if present in db
        const existingReq = await Connection.findOne().or(
            [
                {fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        ); 
        if(existingReq)
            throw new Error("Request already sent");

        const newReq = new Connection(
            { fromUserId, toUserId, status }
        );
        await newReq.save();

        var message;
        if(status === "ignored")
            message = `You have ignored ${touser.firstName}`;
        else
            message = `You have shown interest in ${touser.firstName}`;
        res.status(201).json({message: message, data: newReq});

    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

connectionRouter.post('/review/:status/:requestId', auth, async (req, res) => {
    
    const user = req.user;
    const { status, requestId } = req.params;

    try{
        //checking if status correct
        const allowedStat = ["accepted", "rejected"];
        if(!allowedStat.includes(status))
            throw new Error("Invalid Status");

        //check reqId valid && toUserId should be current userId
        const request = await Connection.findOne(
            {
                _id: requestId,
                toUserId: user._id,
                status: "interested"
            }
        );
        if(!request) throw new Error("Invalid Request Id");

        request.status = status;
        const data = await request.save();
        res.status(200).json({message: `Request is ${status}`, data});

    }catch(err){
        res.status(500).send("Error " + err.message);
    }
});



module.exports = { connectionRouter };