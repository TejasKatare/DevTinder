const express = require('express');
const testRouter = express.Router();

testRouter.get('/', (req, res) => {
    res.send('Welcome to devtinder backend');
});

module.exports = { testRouter };