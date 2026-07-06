const express = require('express');
const testRouter = express.Router();

console.log("TEST ROUTER LOADED");
testRouter.get('/', (req, res) => {
    console.log("ROOT ROUTE HIT");
    res.send('Welcome Please Login or SignUp');
});

module.exports = {testRouter};