import { useContext } from "../../../../react_lite/createDOM";
import { routerContext } from "../../../Router/Router";
import temImg from "../../../Assets/hero/hero_small.jpg"
import { getDate } from "../../../Util/TimeDate";
import { UserContext } from "../../../Contexts/UserContext";
import { shareBlog } from "../../../Utils/shareBlog";


import shareIcon from "../../../Assets/icons/share.png"
import likeIcon from "../../../Assets/icons/like.png"
import likedIcon from "../../../Assets/icons/liked.png"
import saveIcon from "../../../Assets/icons/save.png"
import editIcon from "../../../Assets/icons/edit.svg"
import deleteIcon from "../../../Assets/icons/delete.svg"
import savedIcon from "../../../Assets/icons/saved.png"; // Correct path to the saved icon

function BlogItem({ blog, setBlogs, isOwner, setSavedBlogs }) {

    const {goto} = useContext(routerContext)
    const {user} = useContext(UserContext)
    const blogId = blog._id

    const handleUpdate = (e) => {
        e.stopPropagation();
        goto(`/user/blogs/update/${blogId}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation()
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;
      
          fetch("http://localhost:8080/blog/", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({ blogId }),  
          })
          .then(res=>res.json())
          .then(data=>{
            if(!data.error){
              alert("Blog deleted successfully!");
              setBlogs(prev=>{
                return prev.filter(b=>b._id != blog._id)
              })
            }else{
              alert(`Error deleting blog: ${data.error}`);
            }
          })
          .catch(err=>{
            console.error("Error deleting the blog:", err);
            alert("An unexpected error occurred. Please try again later.");
          })
      };
      
      const handleAddLike = (e) => {
        console.log("blogId:", blog._id)
          e.stopPropagation()
        
            fetch("http://localhost:8080/blog/add-like", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${user.token}`
              },
              body: JSON.stringify({ blogId: blog._id }),  
            })
            .then(res=>res.json())
            .then(data=>{
              if(!data.error){
                console.log(data)
                setBlogs(prev=>{
                  return prev.map(b=>{
                    if(b._id == blog._id){
                      return {...b, isLiked: true, likes: b.likes+1}
                    }else{
                      return b
                    }
                  })
                })
              }else{
                alert(`Error deleting blog: ${data.error}`);
              }
            })
            .catch(err=>{
              console.error("Error deleting the blog:", err);
              alert("An unexpected error occurred. Please try again later.");
            })
        };
  
      const handleRemoveLike = (e) => {
          e.stopPropagation()
        
            fetch("http://localhost:8080/blog/remove-like", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${user.token}`
              },
              body: JSON.stringify({ blogId: blog._id }),  
            })
            .then(res=>res.json())
            .then(data=>{
              if(!data.error){
                setBlogs(prev=>{
                  return prev.map(b=>{
                    if(b._id == blog._id){
                      return {...b, isLiked: false, likes: b.likes-1}
                    }else{
                      return b
                    }
                  })
                })
              }else{
                alert(`Error deleting blog: ${data.error}`);
              }
            })
            .catch(err=>{
              console.error("Error deleting the blog:", err);
              alert("An unexpected error occurred. Please try again later.");
            })
        };
        
      const handleshare = (e) => {
        e.stopPropagation();
        shareBlog(blog);
      };
    
      const handleSave = (e) => {
        e.stopPropagation();
      
        fetch("http://localhost:8080/blog/add-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${user.token}`,
          },
          body: JSON.stringify({ blogId: blog._id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) {
              setBlogs((prev) =>
                prev.map((b) =>
                  b._id === blog._id ? { ...b, isSaved: true } : b
                )
              );
              
              setSavedBlogs((prev) => [...prev, {...blog, isSaved: true}]);
            } else {
              alert(`Error saving blog: ${data.error}`);
            }
          })
          .catch((err) => {
            console.error("Error saving the blog:", err);
            alert("An unexpected error occurred. Please try again later.");
          });
      };
      
      const handleRemoveSave = (e) => {
        e.stopPropagation();
      
        fetch("http://localhost:8080/blog/remove-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${user.token}`,
          },
          body: JSON.stringify({ blogId: blog._id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) {
              setBlogs((prev) =>
                prev.map((b) =>
                  b._id === blog._id ? { ...b, isSaved: false } : b
                )
              );
              setSavedBlogs((prev) => prev.filter((b) => b._id !== blog._id));
            } else {
              alert(`Error removing blog save: ${data.error}`);
            }
          })
          .catch((err) => {
            console.error("Error removing the blog save:", err);
            alert("An unexpected error occurred. Please try again later.");
          });
      };
      
      const viewHandler = () => {
        goto(`/user/blogs/blog/${blogId}`)
      }

      console.log("blog data : ", blog.likes)

    return (
      <div className="blog-item">
        <div className="blog-header">
          <div className="thumbnail-container">
            <div className="thumbnail"><img src={temImg} /></div>
          </div>
          <div className="blog-meta">
            <div className="blog-date">
              {getDate(blog.updatedOn)}
            </div>
            <span>.</span>
            <div className="blog-read-time">
              {10} mins read
            </div>
          </div>
          <div className="body">
            <h2 onClick={viewHandler}>{blog.title}</h2>
            <p onClick={viewHandler}>{blog.description}</p>
          </div>
        </div>
        <div className="blog-item-bottom">
        <div className="profile-date">
          <div className="user-info">
              <div className="profile-image">
                  <img src={temImg} />
              </div>
              <div className="user-name">
                  Hirun
              </div>
          </div>
        </div>
          <div className="blog-actions">
            <div className="left">
              {isOwner && (<button className="icon-button small transparent" onClick={handleUpdate}><img src={editIcon} /></button>)}
              {isOwner && (<button className="icon-button small transparent" onClick={handleDelete}><img src={deleteIcon} /></button>)}
            </div>
            <div className="right">
              <button className="icon-button small transparent" onClick={handleshare}><img src={shareIcon} /></button>
              <button className="icon-button small transparent" onClick={blog.isSaved ? handleRemoveSave : handleSave}><img src={blog.isSaved ? savedIcon : saveIcon} /></button>
              <div className="button-value">
                {!blog.isLiked && (<button className="icon-button small transparent" onClick={handleAddLike}><img src={likeIcon} /></button>)}
                {blog.isLiked && (<button className="icon-button small transparent" onClick={handleRemoveLike}><img src={likedIcon} /></button>)}
                <div>{blog.likes}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default BlogItem;
