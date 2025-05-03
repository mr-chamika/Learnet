const mongoose = require('mongoose');

const schema = mongoose.Schema({

    Answer: String,
    userId: String,
    Votes: { type: Number, default: 0 },
    /* Views: { type: Number, default: 0 }, */
    Post_id: String,
    Author: String,
    Marked: { type: Boolean, default: false },
    comments: Number,
    voted_list: [String]

}, { timestamps: true })

const Answer = mongoose.model('answer', schema);
module.exports = Answer;
