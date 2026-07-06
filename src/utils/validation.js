const validator = require('validator');

const validateUser = function(user){
    //console.log(user);
    const { firstName, lastName, email, password, photoUrl, gender} = user;
    if(password && !validator.isStrongPassword(password))
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol");
    if (email && !validator.isEmail(email))
        throw new Error("Invalid email format");
    if(user.age && (user.age < 18 || user.age > 100))
        throw new Error("Age must be between 18 and 100");
    if(user.skills && user.skills.size > 10)
        throw new Error("You can add up to 10 skills only");
    if(gender != "Male" && gender != "Female" && gender != "Others")
        throw new Error("Not valid Gender");
    return true;
}; 

const validateUserUpdate = function(req){
    const allowedFields = ['firstName', 'lastName', 'photoUrl', 'age', 'gender', 'skills'];
    const isValid = Object.keys(req.body).every((key) => allowedFields.includes(key));
    if (!isValid) {
        throw new Error("Invalid field(s) in update request");
    }
    const updatedUser = req.body;
    validateUser(updatedUser);
}

module.exports = { validateUser, validateUserUpdate };