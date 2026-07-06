const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        maxLength: 100
    },
    photoUrl: {
        type: "String",
        trim: true
    },
    age:{
        type: Number,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    skills:{
        type: [String]
    }
},
{
    timestamps: true,
});

userSchema.methods.validatePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

userSchema.methods.encryptPassword = async function(){
    const passwordHash = await bcrypt.hash(this.password, 10);
    this.password = passwordHash;
}

const User = mongoose.model("User", userSchema);

module.exports = { User };