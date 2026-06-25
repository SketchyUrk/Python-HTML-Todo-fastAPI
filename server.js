require("dotenv").config();

const express = require("express");
const path = require("path");

const Task = require("./models/Task");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


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

app.get("/", (req, res) => {
    res.render("index");
});

const mongoose = require("mongoose");

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

app.get(
    "/tasks",
    async (req, res) => {
        try {
            
            const { username , password } = 
                req.query;

            const tasks = 
                await Task.find({
                    username,
                    password
                }).sort({
                    _id: -1
                });

            res.json(tasks);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

app.post(
    "/tasks",
    async (req, res) => {
        try {
            
            const task = 
                await Task.create({
                    username:
                        req.body.username,
                
                    password:
                        req.body.password,

                    text:
                        req.body.text
                    });

            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

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

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});