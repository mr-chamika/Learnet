const mongoose = require('mongoose');

// const dropIndex = async () => {

//     await mongoose.connection.collection('posts').dropIndex('userId_1');

// }

// dropIndex();

const schema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: String,
    question: String,
    expectation: String,
    tarray: [String],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },
    comments: { type: Number, default: 0 },
    author: String,
    voted_list: [String],
    markedCount: { type: Number, default: 0 }

}, { timestamps: true });

schema.index({ userId: 1 });

const Post = mongoose.model('Post', schema);

module.exports = Post;