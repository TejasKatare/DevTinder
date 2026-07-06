const express = require('express');
const testRouter = express.Router();

testRouter.get('/', (req, res) => {
    res.send('Welcome Please Login or SignUp');
});

module.exports = {testRouter};