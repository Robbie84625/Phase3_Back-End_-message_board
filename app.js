const express = require('express');
const path = require('path');

const uploadRouter = require("./api/upload_api");
const db = require("./database_connect");

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'static')));


app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);

app.use("/", uploadRouter);

app.get("/", (req, res) => {
        res.render('home.html');
    })

app.listen(port, () => {
    console.log(`http://127.0.1:${port}`);
});



