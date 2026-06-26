console.log("SERVER FILE LOADED");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        await User.create({ username, password });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ success: false });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const { username, password } = req.query;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid user" });
        }

        const tasks = await Task.find({ username });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { text, username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid user" });
        }

        const task = await Task.create({
            text,
            username,
            completed: false
        });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo")
    .then(async () => {
        console.log("MongoDB Connected");

        const count = await User.countDocuments();

        if (count === 0) {
            await User.create([
                { username: "user1", password: "user1" },
                { username: "user2", password: "user2" }
            ]);

            console.log("Seed users created");
        }
    })
    .catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});