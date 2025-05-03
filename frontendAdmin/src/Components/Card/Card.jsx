import "./Card.css"
import tstImg from "../../Assets/features/blog.jpg"
import voteIcon from "../../Assets/icons/like.png"
import commentIcon from "../../Assets/icons/notifications.svg"
import { useContext, useEffect, useState } from "../../../../frontend/react_lite/createDOM";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { getDate, getTimeDate } from "../../Util/TimeDate"
import { UserContext } from "../../Contexts/UserContext"
import Link from "../../../../frontend/src/Router/Link";


const Card = ({data, openReportPopup}) => {

    const type = data.type
    const title = data.name
    const createdOn = data.createdOn
    const link = data.link
    const license = data.license
    const description = data.description
    // const thumbnail = data.thumbnail
    const [thumbnail, setThumbnail] = useState("")
    const tags = data.tags
    const votes = data.votes
    const comments = data.comments
    const content = data.content

    const {users: otherUsers, fetchUsersIfNotExist} = useContext(otherUsersContext)
    const {user} = useContext(UserContext)
    
    useEffect(()=>{
        fetchUsersIfNotExist([data.userId])
        if(thumbnail){
            URL.revokeObjectURL(thumbnail)
        }
        setThumbnail(null)
        if(data.type === "file"){
            fetch("http://localhost:8080/content/get/file", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({
                    fileId: data._id
                })
            })
            .then(res=>res.blob())
            .then(blob=>{
                const url = URL.createObjectURL(blob)
                setThumbnail(url)
            })
        }else{
            setThumbnail(null)
        }
    }, [data._id])

    const owner = otherUsers[data.userId]
    const date = getDate(data.updatedOn)
    const time = getTimeDate(data.updatedOn, "HH-MM")[1]

    const [showPIContext, setShowPIContext] = useState(false)
    const piContextHandler = (e) => { 
        e.preventDefault()
        setShowPIContext(prev=>!prev)
    }

    return ( 
        <div className="content-card">
            <div>
                <div className="user-info">
                    <div>
                        <div className="profile-image" onContextMenu={piContextHandler} onClick={()=>setShowPIContext(false)}>
                            <img src={tstImg} />
                            { showPIContext && (
                                <div className="profile-image-context">
                                    <Link to={`/user/profile/${data.userId}`}>View profile</Link>
                                </div>
                            )}
                        </div>
                        <div className="user-info-right">
                            <div className="user-name">
                                {owner ? (<span>{owner.name}</span>) : (<span>Loading...</span>)}
                            </div>
                            <div className="created-on">
                                {date} at {time}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className="content">
                        {
                            thumbnail &&
                            (
                                <div className="thumbnail-container">
                                    {data.fileType === "pdf" ? (
                                            <iframe
                                                src={thumbnail+"#toolbar=0&scrollbar=0&navpanes=0"}
                                                width="100%"
                                                height="600px"
                                                title="PDF Viewer"
                                                style={{ border: "1px solid #ccc" }}
                                            ></iframe>
                                        ):
                                        (
                                            <img className="thumbnail" src={thumbnail} />
                                        )
                                    }
                                </div>
                            )
                        }
                        {   type === "file" && !thumbnail &&
                            (
                                <div className="thumbnail-container center-aligned-message-container">
                                    <div className="center-aligned-message">
                                        Loading...
                                    </div>
                                </div>
                            )
                        }
                        {
                            type === "note" && (
                                <div className="text-content">
                                    {content}
                                </div>
                            )
                        }
                        {link && (<div className="card-link"><a href={link}>{link}</a></div>)}
                        <div className="card-top">
                            <div className="card-top-left">
                                <div className="title">{title}</div>
                                {/* <div className="created-on">{createdOn}</div> */}
                            </div>
                            <div className="card-top-right">
                                <div className="lisence">{license}</div>
                            </div>
                        </div>
                        <div className="description">{description}</div>
                    </div>
                </div>
                <div className="updated-on"></div>
                <div className="content-tags-container">
                    {tags && tags.map(tag=>{
                        return (
                            <div className="content-tag">{tag}</div>        
                        )
                    })}
                </div>
                {/* <div className="card-bottom">
                    <div className="card-bottom-left">
                        <div className="votes"><img src={voteIcon} /><span>{votes ? votes : 0}</span></div>
                        <div className="comments"><img src={commentIcon} /><span>{comments ? comments : 0}</span></div>
                    </div>
                    <div className="card-bottom-right">
                        <button>share</button>
                    </div>
                </div> */}
            </div>
        </div>
     );
}
 
export default Card;