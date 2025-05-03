const BlogComment = require("../models/Blog/BlogCommentsModel");
const BlogLike = require("../models/Blog/BlogLikesModel");
const Blog = require("../models/Blog/BlogModel");
const User = require("../models/UserModel");
const { strToObjId } = require("../utils/strToObjId");
const BlogSaves = require("../models/Blog/BlogSaves.js");

async function getReleventBlogs(req, res) {
  // const userId = "673c247a763762263af973b8";
  // const {userId} = req.user.userId

  // res.json({ userId });

  const userId = req.user.userId
  const uid = strToObjId(userId)
  const blogSaves = await BlogSaves.findOne({userId: uid})
  const blogs = await Blog.find({$and : [{$nor: [{userId: uid}]}, {_id: {$nin : blogSaves.blogIds}}]})
  const updatedBlogs = []
  const length = blogs.length
  for(let i = 0; i < length; i++){
    const blogLike = await BlogLike.findOne({blogId: blogs[i]._id, userId})
    if(blogLike){
      blogs[i].isLiked = true
      updatedBlogs.push({...blogs[i]._doc, isLiked: true})
    }else{
      updatedBlogs.push({...blogs[i]._doc, isLiked: false})
    }
  }
  // console.log(blogs.map(blog=>{return {...blog}}))
  res.json(updatedBlogs)
}


async function getOneBlog(req, res) {
    const { Id } = req.body;
    const {userId} = req.user

    // console.log("id : ", Id)
    const blog = await Blog.findById(Id); 
    const blogLike = await BlogLike.findOne({blogId: Id, userId})
    const blogComment = await BlogComment.findOne({blogId: Id, userId})

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" }); 
    }

    if(blogLike){
      res.json({...blog._doc, isLiked: true, blogComment});
    }else{
      res.json({...blog._doc, isLiked: false, blogComment});
    }
}

  

async function createBlog(req, res) {
  // const {userId} = req.user.userId
  const userId = req.user.userId
  const { title, description, tags, content } = req.body;

  const newBlog = Blog.createBlog(userId, title, description, tags, content);
  res.json(newBlog);
}

async function updateBlog(req, res) {
  // const {userId} = req.user.userId
  const userId = req.user.userId
  const { blogId, title, description, tags, content } = req.body;

  const blog = await Blog.getBlog(blogId);
  // console.log("blog: ", blog)
  if(!blog){
      res.json({ error: "Blog cannot be found..." });
      return 
  }
  if (!blog.userId.equals(userId)) {
    res.json({ error: "Only the owner could update a blog" });
  } else {
    blog.updateBlog(title, description, tags, content);
    const updatedBlog = await blog.updateAndSaveBlog(
      title,
      description,
      tags,
      content
    );
    res.json(updatedBlog);
  }
}

// async function deleteBlog(req, res) {
//   // const {userId} = req.user.userId
//   const userId = "673c247a763762263af973b8";
//   const { blogId } = req.body;

//   const blog = Blog.getBlog(blogId);
//   if (blog.userId.equals(userId)) {
//     await Blog.deleteBlog(blogId);
//     res.json({ success: "Blog deleted successfully" });
//   } else {
//     res.json("Only the owner could delete a blog");
//   }
// }
async function deleteBlog(req, res) {
    const { blogId } = req.body;  
    const userId = req.user.userId
  
    if (!blogId) {
      return res.status(400).json({ message: "blogId is required." });
    }
  
    try {
      
      const blog = await Blog.findById(blogId);  
  
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
  
      if (!blog.userId.equals(userId)) {
        return res.status(403).json({ error: "You are not authorized to delete this blog" });
      }
  
      await Blog.deleteOne({_id: blogId}); 
  
      return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error deleting the blog" });
    }
  }
  

// const deleteBlog = async (req, res) => {

//     try {


//         const { blogId } = req.body;
//         const currentPost = await Post.findByIdAndDelete({ _id: blogId });

//         if (currentPost) { res.json({ message: "badu hambuna" }) } else { res.json({ message: "kes bun" }) }

//     } catch (error) {

//         res.json({ message: "error ekek bosa" })

//     }

// }

async function addLike(req, res) {
  const { blogId } = req.body;
  const { userId } = req.user

  try {
    console.log("blogId: ", blogId)
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const blogLike = new BlogLike({blogId, userId})
    await blogLike.save()
    await Blog.updateOne({_id: blogId}, {$inc: {likes: 1}})
    res.json({ success: true, claps: blog.claps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeLike(req, res) {
  const { blogId } = req.body;
  const { userId } = req.user

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await BlogLike.deleteOne({blogId, userId})
    await Blog.updateOne({_id: blogId}, {$inc: {likes: -1}})
    res.json({ success: true, claps: blog.claps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function addComment(req, res) {
  const { blogId, comment } = req.body;
  const {userId} = req.user

  // try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = new BlogComment({blogId, userId, comment})
    await newComment.save()
    await Blog.updateOne({_id: blogId}, {$inc: {comments: 1}})
    res.json(newComment);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
}

async function removeComment(req, res) {
  const { blogId } = req.body;
  const {userId} = req.user

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await BlogComment.deleteOne({blogId, userId})
    await Blog.updateOne({_id: blogId}, {$inc: {comments: -1}})
    res.json({ success: true, comments: blog.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBlogComments(req, res) {
  const { blogId, page } = req.body;
  const {userId} = req.user
  const limit = 10

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const blogComments = await BlogComment.find({$and: [{blogId}, {userId: {$ne: userId}}]}).skip(page * limit).limit(limit)
    res.json(blogComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addCommentLike(req, res) {
  const { commentId } = req.body;
  const {userId} = req.user

    const updatedComment = await BlogComment.findOneAndUpdate({_id: commentId}, {$addToSet: {likes: userId}}, {new: true})
    res.json(updatedComment);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
}

async function removeCommentLike(req, res) {
  const { commentId } = req.body;
  const {userId} = req.user

    const updatedComment = await BlogComment.findOneAndUpdate({_id: commentId}, {$pull: {likes: userId}}, {new: true})
    res.json(updatedComment);
 
}





const addSave = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user.userId;

  try {
    let blogSave = await BlogSaves.findOne({ userId });

    if (!blogSave) {
     
      blogSave = new BlogSaves({ userId, blogIds: [blogId] });
    } else {
      
      if (!blogSave.blogIds.includes(blogId)) {
        blogSave.blogIds.push(blogId);
      }
    }

    await blogSave.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to save blog." });
  }
};

const removeSave = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user.userId;

  try {
    const blogSave = await BlogSaves.findOne({ userId });

    if (blogSave) {
      
      blogSave.blogIds = blogSave.blogIds.filter(
        (id) => id.toString() !== blogId
      );
      await blogSave.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error removing blog save:", error);
    res.status(500).json({ error: "Failed to remove blog save." });
  }
};

async function getUserTags(req, res) {
  const userId = "673c247a763762263af973b8";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, tags: user.favoriteTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function updateUserTags(req, res) {
  const { tags } = req.body;
  const userId = "673c247a763762263af973b8";

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favoriteTags = tags;
    await user.save();
    res.json({ success: true, tags: user.favoriteTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserBlogs(req, res) {
  const userId = req.user.userId

  const uid = strToObjId(userId)

  try {
    const blogs = await Blog.find({ userId: uid }).sort({ createdOn: -1 }); // Sort by newest first
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ blogs : ", blogs)
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: "Error fetching user blogs." });
  }
}


const getSavedBlogs = async (req, res) => {

  const userId = req.user.userId

  try {
    /* const blogSave = await BlogSaves.findOne({ userId }).populate("blogIds"); */
     const blogSave = await BlogSaves.findOne({ userId: userId })
     .populate('blogIds')

    /* if (!blogSave || blogSave.blogIds.length === 0) {
      // Send response and return to prevent further execution
      return res.json({ savedBlogs: [] });
    } */

      /* if(blogSave){res.json("success")}else{res.json("error")} */
    console.log("blog save : ", blogSave)
      if(blogSave){res.json(blogSave.blogIds)}

  /*   // Send response with saved blogs
    res.json({ savedBlogs: blogSave.blogIds });
  } catch (error) {
    console.error("Error fetching saved blogs:", error);
    // Send error response
    res.status(500).json({ error: "Failed to fetch saved blogs." });
  } */
}catch(error){

  res.json(error);

}
}

module.exports = {
  getReleventBlogs,
  getOneBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  addLike,
  removeLike,
  addComment,
  removeComment,
  getBlogComments,
  addCommentLike,
  removeCommentLike,
  addSave,
  getUserTags,
  updateUserTags,
  getUserBlogs,
  getSavedBlogs,
  removeSave,
  
};
