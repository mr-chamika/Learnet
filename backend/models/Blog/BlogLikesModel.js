const mongoose = require("mongoose");

const blogLikeSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true }, // Index for fast lookup
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Index for user searches
  createdAt: { type: Date, default: Date.now, index: { expires: "30d" } } // TTL index to auto-delete after 30 days
});

// Unique compound index to prevent duplicate likes by the same user on the same blog
blogLikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const BlogLike = mongoose.model("BlogLike", blogLikeSchema);

module.exports = BlogLike;
