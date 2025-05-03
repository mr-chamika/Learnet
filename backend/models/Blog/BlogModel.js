const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0, 
  },
  comments: {
    type: Number,
    default: 0, 
  },
  // comments: [
  //   {
  //     userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  //     comment: String,
  //     createdOn: { type: Date, default: Date.now },
  //   },
  // ],
  saves: [
    {
      userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },

  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

BlogSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

BlogSchema.statics = {
  getBlog: async function (blogId) {
    const blog = await this.findById(blogId)
    if (!blog) throw Error("Blog specified cannot be found");
    return blog;
  },
  createBlog: async function (userId, title, description, tags, content) {
    const newBlog = new this({ userId, title, description, tags, content });
    newBlog.save();
    return newBlog;
  },
  deleteBlog: async function (blogId) {
    const deletedBlog = await this.findOneAndDelete({ _id: blogId });
    return deletedBlog;
  },
};

BlogSchema.methods = {
  updateBlog: async function (title, description, tags, content) {
    if (title) {
      this.title = title;
    }
    if (description) {
      this.description = description;
    }
    if (tags) {
      this.tags = tags;
    }
    if (content) {
      this.content = content;
    }
    return this;
  },
  updateAndSaveBlog: async function (title, description, tags, content) {
    this.updateBlog(title, description, tags, content);
    await this.save();
    return this;
  },
};

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
