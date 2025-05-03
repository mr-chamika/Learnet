export const shareBlog = (blog) => {
  const blogUrl = `${window.location.origin}/user/blogs/blog/${blog._id}`;
  
  if (navigator.share) {
    // Use the Web Share API if available
    navigator.share({
      title: blog.title,
      text: blog.description,
      url: blogUrl,
    })
    
    .catch((error) => {
      console.error("Error sharing the blog:", error);
      alert("An error occurred while sharing the blog.");
    });
  } else {
  
    navigator.clipboard.writeText(blogUrl)
      .then(() => {
        alert("Blog link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying the blog link:", error);
        alert("An error occurred while copying the blog link.");
      });
  }
};