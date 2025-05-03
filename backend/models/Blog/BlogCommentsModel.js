const mongoose = require("mongoose");

const commentReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Index for user searches
  reply: { type: String, required: true },
  likes: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now, index: { expires: "30d" } } // TTL index to auto-delete after 30 days
});

const blogCommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true }, // Index for fast lookup
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Index for user searches
  comment: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }],
  replies: [commentReplySchema],
  createdOn: { type: Date, default: Date.now }
//   createdAt: { type: Date, default: Date.now, index: { expires: "30d" } } // TTL index to auto-delete after 30 days
});

// Unique compound index to prevent duplicate likes by the same user on the same blog
blogCommentSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const BlogComment = mongoose.model("BlogComment", blogCommentSchema);

module.exports = BlogComment;
