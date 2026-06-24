require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const Task = require("./models/Task");

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error(err);
    });

mongoose.connect(
    process.env.MONGODB_URI
);

console.log(process.env.MONGODB_URI);

app.use(
    "/static",
    express.static(
        path.join(__dirname, "public")
    )
);

app.get("/", (req, res) => {
    res.render("index");
});