import temImg from "../../Assets/hero/hero_small.jpg"
import { useContext } from "../../../react_lite/createDOM";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { getDate } from "../../Util/TimeDate";

import shareIcon from "../../Assets/icons/share.png"
import likeIcon from "../../Assets/icons/like.png"
import likedIcon from "../../Assets/icons/liked.png"
import saveIcon from "../../Assets/icons/save.png"
import editIcon from "../../Assets/icons/edit.svg"
import deleteIcon from "../../Assets/icons/delete.svg"
import commentIcon from "../../Assets/icons/chat.svg"
import { routerContext } from '../../Router/Router';
import { formDataToObj } from '../../Util/FormDataToObj';
import { UserContext } from "../../Contexts/UserContext";

const BlogComment = ({comment, setComments, key, isCommented, handleRemoveComment}) => {

    const {user} = useContext(UserContext)
    const {users} = useContext(otherUsersContext)
    const isLiked = comment.likes.includes(user.userId)

    const handleAddLike = (e) => {
        e.stopPropagation()
    
        fetch("http://localhost:8080/blog/add-comment-like", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({ commentId: comment._id }),  
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setComments(prev=>{
                    const updated = prev.map(c=>{
                        if(c._id === data._id){
                            return data
                        }else{
                            return c
                        }
                    })
                    return updated
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
    
        fetch("http://localhost:8080/blog/remove-comment-like", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({ commentId: comment._id }),   
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setComments(prev=>{
                    const updated = prev.map(c=>{
                        if(c._id === data._id){
                            return data
                        }else{
                            return c
                        }
                    })
                    return updated
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

    return ( 
        <div className="comment">
            <div className="user-info">
                <div className="profile-image">
                    <img src={temImg} />
                </div>
                <div className="user-info-right">
                    <div className="user-name">
                        {users[comment.userId]?.name}   
                    </div>
                    <div className="blog-meta">
                        <div className="blog-date">
                        {getDate(comment.createdOn)}
                        </div>
                        {/* <span>.</span>
                        <div className="blog-read-time">
                        {10} mins read
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="body">
                {comment.comment}
            </div>
            <div className="comment-bottom">
                {!isLiked && (<button className="icon-button small transparent" onClick={handleAddLike}><img src={likeIcon} /></button>)}
                {isLiked && (<button className="icon-button small transparent" onClick={handleRemoveLike}><img src={likedIcon} /></button>)}
                <button className="icon-button small transparent" onClick={handleRemoveLike}><img src={commentIcon} /></button>
                {isCommented && key === 0 && (
                    <button className="icon-button small transparent" onClick={handleRemoveComment}><img src={deleteIcon} /></button>
                )}
            </div>
        </div>
     );
}
 
export default BlogComment;