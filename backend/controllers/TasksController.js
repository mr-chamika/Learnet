const Task = require("../models/Task");

// Create a task
exports.createTask = async (req, res) => {
    //console.log("creating task...")
    const { title, date, description, completed, important } = req.body;

    if (!title || !date || !description) {
        return res.status(400).json({ error: "Missing Required fields!" });
    }
    if (title.length < 3 ) {
        return res.status(400).json({ error: "Title must be at least 3 characters long!" });
    }

    try {
        const newTask = new Task({
            title,
            date,
            description,
            isCompleted:completed,
            isImportant:important,
            userId: req.user.userId,
        });
        const savedTask = await newTask.save();
        return res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create task" });
    }
};

// Retrieve all tasks for the current user
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

// Retrieve a single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });
        }

        if (task.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to view this task!" });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve task" });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { id, title, date, description, isCompleted, isImportant } = req.body;
    console.log("updating task...", id, title, date, description, isCompleted, isImportant)

    // if (!title || !date || !description) {
    //     return res.status(400).json({ error: "All fields are required for update!" });
    // }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });
        }

        if (task.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this task!" });
        }
        
        if (title !== undefined) task.title = title;
        if (date !== undefined) task.date = date;
        if (description !== undefined) task.description = description;
        if (isCompleted !== undefined) task.isCompleted = isCompleted;
        if (isImportant !== undefined) task.isImportant = isImportant;
        //task.title = title;
        //task.date = date;
        //task.description = description;

        const updatedTask = await task.save();
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update task" });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });
        }

        if (task.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this task!" });
        }

        await Task.deleteOne({ _id: id });
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete task" });
    }
};




/*const Task = require("../models/Task");

// Hardcoded user ID
const currentUserId = "673c247a763762263af973b8";

// Create an task
exports.createTask = async (req, res) => {
    const { title, date, description } = req.body;

    if (!title || !date || !description ) {
        return res.json({ error: "All fields are required!" });
    }

    try {
        const newTask = new Task({
            title,
            date,
            description,
            userId: currentUserId,
        });
        const savedTask = await newTask.save();
        return res.json(savedTask);
    } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to create task" });
    }
};

// Retrieve all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

// Retrieve a single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });
        }
        return res.status(200).json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve task" });
    }
};

// Update an task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, date, description } = req.body;

    if (!title || !date || !description ) {
        return res.status(400).json({ error: "All fields are required for update!" });
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });
        }

        if (task.userId !== currentUserId) {
            return res.status(403).json({ error: "You are not authorized to update this task!" });
        }

        task.title = title;
        task.date = date;
        task.description = description;
    
        const updatedTask = await task.save();
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update task" });
    }
};

// Delete an task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found!" });            
        }

        if (task.userId !== currentUserId) {
            return res.status(403).json({ error: "You are not authorized to delete this task!" });
        }

        await Task.deleteOne({ _id: id });
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete task" });
    }
};
*/