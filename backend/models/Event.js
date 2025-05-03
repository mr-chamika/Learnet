const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    visibility: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PRIVATE",
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
