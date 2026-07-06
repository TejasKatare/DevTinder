const express = require("express");
const { User } = require("../models/user.js");
const { auth } = require("../middlewares/userAuth.js");
const { validateUser, validateUserUpdate } = require("../utils/validation.js");
const validator = require("validator");

const profileRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills";

profileRouter.get("/getinfo", auth, (req, res) => {
  const safeUserData = {};
  USER_SAFE_DATA.split(" ").forEach((key) => {
    safeUserData[key] = req.user[key];
  });
  res.status(201).send(safeUserData);
});

profileRouter.delete("/delete", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    res.status(201).send("Account Deleted Successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

profileRouter.patch("/update", auth, async (req, res) => {
  try {
    validateUserUpdate(req);
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    validateUser(loggedinUser);
    await loggedinUser.save();
    const safeUserData = {};
    USER_SAFE_DATA.split(" ").forEach((key) => {
      safeUserData[key] = req.user[key];
    });
    res.status(200).json({
      message: `${loggedinUser.firstName} updated successfully`,
      data: safeUserData,
    });
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

profileRouter.patch("/changecreds", auth, async (req, res) => {
  try {
    const { oldemail, oldpassword, newemail, newpassword } = req.body;
    const loggedinUser = req.user;
    loggedinUser.validatePassword(oldpassword);
    if (!validator.isEmail(newemail)) throw new Error("Email is not valid");
    if (!validator.isStrongPassword(newpassword))
      throw new Error("Not a strong password ");
    loggedinUser.email = newemail;
    loggedinUser.password = newpassword;
    await loggedinUser.encryptPassword();
    loggedinUser.save();
    res.status(200).send("Creds are updated successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = { profileRouter };
