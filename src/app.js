const express = require('express');

const app = express();
const port = 7777;

app.get('/data', (req, res) => {
    const data = {firstName: "Tejas", lastName: "Katare", age: 22, city: "Pune" };
    res.send(data);
});

app.post('/data', (req, res) => {
    const data = "Your data has been successfully added to the server.";
    res.send(data);
});

app.delete('/data', (req, res) => {
    const data = "Your data has been successfully deleted from the server.";
    res.send(data);
});

app.put('/data', (req, res) => {
    const data = "Your data has been successfully updated in the server.";
    res.send(data);
});

app.use('/', (req, res) => {
    res.send('Hello BKL Tejas!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});