const { User } = require("../models/user");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token) return res.status(401).json({"message": "Error: Token is not valid!!"});
        const decodedObj = await jwt.verify(token, "Tejas@123");
        const { userId } = decodedObj;
        const user = await User.findById(userId);
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
};

module.exports = { auth };
