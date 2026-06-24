require("dotenv").config();


console.log("SERVER STARTED");


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Task = require("./models/Task");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/tasks", async (req, res) => {
    console.log("GET /tasks hit");

    try {
        const tasks = await Task.find().sort({ _id: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.use(
    "/static",
    express.static(
        path.join(
            __dirname,
            "models",
            "views",
            "public"
        )
    )
);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(
        __dirname,
        "models",
        "views"
    )
);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(
            "MongoDB connected"
        );
    })
    .catch(err => {
        console.error(err);
    });

app.get("/", (req, res) => {
    res.render("index");
});



app.post("/tasks", async (req, res) => {
    console.log("Body:", req.body);

    try {
        const task = await Task.create({
            text: req.body.text
        });

        res.status(201).json(task);
    } catch (err) {
        console.error("CREATE TASK ERROR:");
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.put(
    "/tasks/:id",
    async (req, res) => {
        try {
            const task =
                await Task.findById(
                    req.params.id
                );

            if (!task) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Task not found"
                    });
            }

            task.completed =
                !task.completed;

            await task.save();

            res.json(task);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

app.delete(
    "/tasks/:id",
    async (req, res) => {
        try {
            await Task.findByIdAndDelete(
                req.params.id
            );

            res.json({
                success: true
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);