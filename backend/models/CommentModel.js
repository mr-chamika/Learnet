const mongoose = require('mongoose');

const schema = mongoose.Schema({

    Comment: String,
    UserId: String,
    Author: String,
    Answer_id: String,
    Question_id: String,

}, { timestamps: true })

const Comment = mongoose.model("comment", schema)

module.exports = Comment;