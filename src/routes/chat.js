const express = require('express');
const { auth } = require('../middlewares/userAuth');
const { Chat } = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get('/get/:targetUserId', auth ,async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try{
        let chat = await Chat.findOne(
            { participants: { $all: [userId, targetUserId]}}
        );
        if(!chat){
            chat = new Chat(
                {
                    participants: [userId, targetUserId],
                    messages: []
                }
            );
            await chat.save();
        }
        res.json(chat);
    }
    catch(err){
        console.error(err)
    };
});

module.exports = chatRouter;