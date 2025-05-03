import './BlogDataBox.css'
import temImg from "../../Assets/hero/hero_small.jpg"
import { getDate, getTimeDate } from "../../Util/TimeDate";
import { useContext, useEffect, useState } from '../../../react_lite/createDOM';
import { UserContext } from '../../Contexts/UserContext';

import shareIcon from "../../Assets/icons/share.png"
import likeIcon from "../../Assets/icons/like.png"
import likedIcon from "../../Assets/icons/liked.png"
import saveIcon from "../../Assets/icons/save.png"
import editIcon from "../../Assets/icons/edit.svg"
import deleteIcon from "../../Assets/icons/delete.svg"
import commentIcon from "../../Assets/icons/chat.svg"
import { routerContext } from '../../Router/Router';
import { formDataToObj } from '../../Util/FormDataToObj';
import { otherUsersContext } from '../../Contexts/OtherUsersContext';
import BlogComment from './BlogComment';
import { shareBlog } from '../../Utils/shareBlog';


const BlogDataBox = ({blog}) => {

    let publishedOn = getDate(blog.createdOn)
    // if(blog){
    //     tagsData = blog.tags
    //     publishedOn = new Date(blog.createdOn).toLocaleDateString()
    // }

    const [blogState, setBlogState] = useState(blog)
    const [comments, setComments] = useState([])

    const {user} = useContext(UserContext)
    const {goto} = useContext(routerContext)
    const {users, fetchUsersIfNotExist} = useContext(otherUsersContext)
    const [isCommented, setIsCommented] = useState(blog.blogComment?._id ? true : false)

    useEffect(()=>{
      fetch(`http://localhost:8080/blog/get-comments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          authorization: `bearer ${user.token}`,
        },
        body: JSON.stringify({ blogId: blogState._id, page: 0 }),
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("comments: ", data)
            if(!data.error){
                const userIds = data.map(comment=>comment.userId)
                fetchUsersIfNotExist([...userIds, user.userId])
                if(isCommented){
                    setComments([blog.blogComment, ...data])
                }else{
                    setComments(data)
                }
                }
          })
        //   .catch((err) => {
        //     console.log("error : ", err)
        // });
    }, [user])

    const handleUpdate = (e) => {
      e.stopPropagation();
      goto(`/user/blogs/update/${blogState._id}`);
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
          body: JSON.stringify({ blogId: blogState._id }),  
        })
        .then(res=>res.json())
        .then(data=>{
          if(!data.error){
            alert("Blog deleted successfully!");
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
            body: JSON.stringify({ blogId: blogState._id }),  
          })
          .then(res=>res.json())
          .then(data=>{
            if(!data.error){
              console.log(data)
              setBlogState(prev=>{return {...prev, isLiked: true, likes: prev.likes+1}})
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
            body: JSON.stringify({ blogId: blogState._id }),  
          })
          .then(res=>res.json())
          .then(data=>{
            if(!data.error){
              setBlogState(prev=>{return {...prev, isLiked: false, likes: prev.likes-1}})
            }else{
              alert(`Error deleting blog: ${data.error}`);
            }
          })
          .catch(err=>{
            console.error("Error deleting the blog:", err);
            alert("An unexpected error occurred. Please try again later.");
          })
      };

    const handleAddComment = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const comment = data.comment
      
          fetch("http://localhost:8080/blog/add-comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({ blogId: blogState._id, comment }),  
          })
          .then(res=>res.json())
          .then(data=>{
            if(!data.error){
              console.log("comment: ", data)
                setComments(prev=>{return [data, ...prev]})
                setIsCommented(true)
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

    const handleRemoveComment = (e) => {
        e.preventDefault()
      
          fetch("http://localhost:8080/blog/remove-comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({ blogId: blogState._id }),  
          })
          .then(res=>res.json())
          .then(data=>{
            if(!data.error){
                setComments(prev=>{
                    prev.shift()
                    return [...prev]
                })
                setIsCommented(false)
            }else{
              alert(`Error deleting blog: ${data.error}`);
            }
          })
        //   .catch(err=>{
        //     console.error("Error deleting the blog:", err);
        //     alert("An unexpected error occurred. Please try again later.");
        //   })
      };
      
      


      const isOwner = blog.userId === user.userId ? true : false
    //   console.log("isOwner: ", isOwner, blog, user)
    //   console.log("users: ", users)

    console.log("blog : ", blog)
    return (
        <div className="blog-details">
          <h1 className="title">{blogState.title}</h1>
          <p className="description">{blogState.description}</p>
          <div className="user-info">
              <div className="profile-image">
                  <img src={temImg} />
              </div>
              <div className="user-info-right">
                <div className="user-name">
                    Hirun
                </div>
                <div className="blog-meta">
                  <div className="blog-date">
                    {getDate(blogState.updatedOn)}
                  </div>
                  <span>.</span>
                  <div className="blog-read-time">
                    {10} mins read
                  </div>
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
              <button className="icon-button small transparent" onClick={handleUpdate}><img src={saveIcon} /></button>
              {!blogState.isLiked && (<button className="icon-button small transparent" onClick={handleAddLike}><img src={likeIcon} /></button>)}
              {blogState.isLiked && (<button className="icon-button small transparent" onClick={handleRemoveLike}><img src={likedIcon} /></button>)}
            </div>
          </div>
          <div>
            Likes : {blogState.likes}
          </div>
          <div>
            Comments : {blogState.comments}
          </div>
          <p className="blog-tags">
            {
              blogState.tags && blogState.tags.map((tag)=>{
                return (
                  <div className="tag">
                    {tag}
                  </div>
                )
              })
            }
          </p>
          <div className="content">
            {blogState.content}
          </div>
          <div className="blog-comments">
            {!isCommented && (
                <div className="comment-input">
                    <div className="user-info">
                        <div className="profile-image">
                            <img src={temImg} />
                        </div>
                        <div className="user-info-right">
                            <div className="user-name">
                                {user.name}   
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleAddComment}>
                        <textarea name="comment" value="" placeholder="Enter your comment here"></textarea>
                        <input className="icon-button" type="submit" value="Add comment" />
                    </form>
                </div>
            )}
            {
              comments && comments.map((comment, index)=>{
                return (
                    <BlogComment comment={comment} setComments={setComments} key={index} isCommented={isCommented} handleRemoveComment={handleRemoveComment}/>
                )
              })
            }
          </div>
        </div>
    );
}

export default BlogDataBox