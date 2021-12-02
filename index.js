const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

const port = process.env.DEV_PORT;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
