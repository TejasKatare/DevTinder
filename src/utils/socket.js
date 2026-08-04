const socket = require("socket.io");
const crypto = require('crypto');
const { Chat }  = require('../models/chat');
const getSecretRoomId = (combined) => {
    return crypto.createHash('sha256').update(combined).digest('hex');
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FrontEnd_URL,
        },
    });

    io.on('connection', (socket) => {
        //Handle events

        socket.on('joinChat', ({userId, targetUserId}) => {
            const combined = [userId, targetUserId].sort().join('_');
            const roomId = getSecretRoomId(combined);
            socket.join(roomId);
        });

        socket.on('sendMessage', async (
            {
                userId,
                targetUserId,
                text
            }
        ) => {
            
            //save chats to db
            try{
                
                const combined = [userId, targetUserId].sort().join('_');
                const roomId = getSecretRoomId(combined);
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({senderId: userId, text});
                const curChat = chat.messages.at(-1);
                await chat.save();
                //console.log(userId, text);
                io.to(roomId).emit("messageReceived", 
                    curChat
                );
            }
            catch(err){
                console.error(err);
            };

        });

        socket.on('disconnect', () => {});
    });
};

module.exports = initializeSocket