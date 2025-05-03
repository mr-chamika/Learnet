const mongoose = require("mongoose");

const BlogSavesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], 
});

module.exports = mongoose.model("BlogSaves", BlogSavesSchema);