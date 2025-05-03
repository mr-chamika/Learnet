const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isImportant: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;