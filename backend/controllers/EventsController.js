const Event = require("../models/Event");

// Create an event
exports.createEvent = async (req, res) => {
    const { title, date, description, location, visibility } = req.body;

    if (!title || !date || !description || !location) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const newEvent = new Event({
            title,
            date,
            description,
            location,
            visibility,
            userId: req.user.userId,
        });
        const savedEvent = await newEvent.save();
        return res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create event" });
    }
};

// Retrieve all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({userId: req.user.userId});
        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve events" });
    }
};

// Retrieve a single event by ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }
        if (event.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to view this event!" });
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve event" });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const { id, title, date, description, location } = req.body;

    if (!title || !date || !description || !location) {
        return res.status(400).json({ error: "All fields are required for update!" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }

        if (event.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this event!" });
        }

        if(title !== undefined) event.title = title;
        if(date !== undefined) event.date = date;
        if(description !== undefined) event.description = description;
        if(location !== undefined) event.location = location;

        const updatedEvent = await event.save();
        return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update event" });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;  //req.query

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }

        if (event.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this event!" });
        }

        await Event.deleteOne({ _id: id });
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete event" });
    }
};


/*
// Hardcoded user ID
const currentUserId = "673c247a763762263af973b8";

// Create an event
exports.createEvent = async (req, res) => {
    const { title, date, description, location } = req.body;

    if (!title || !date || !description || !location) {
        return res.json({ error: "All fields are required!" });
    }

    try {
        const newEvent = new Event({
            title,
            date,
            description,
            location,
            userId: currentUserId,
        });
        const savedEvent = await newEvent.save();
        return res.json(savedEvent);
    } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to create event" });
    }
};

// Retrieve all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve events" });
    }
};

// Retrieve a single event by ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve event" });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, description, location } = req.body;

    if (!title || !date || !description || !location) {
        return res.status(400).json({ error: "All fields are required for update!" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }

        if (event.userId !== currentUserId) {
            return res.status(403).json({ error: "You are not authorized to update this event!" });
        }

        event.title = title;
        event.date = date;
        event.description = description;
        event.location = location;

        const updatedEvent = await event.save();
        return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update event" });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found!" });
        }

        if (event.userId !== currentUserId) {
            return res.status(403).json({ error: "You are not authorized to delete this event!" });
        }

        await Event.deleteOne({ _id: id });
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete event" });
    }
};*/
