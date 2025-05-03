import "./ContentDetails.css"

import { useContext, useEffect, useState } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import tstImg from "../../../Assets/grp.jpg"
import editIcon from "../../../Assets/icons/edit.svg"
// import MemberBox from "./MemberBox";
import { formDataToObj } from "../../../Util/FormDataToObj";
import { getDate, getTimeDate } from "../../../Util/TimeDate";
import { isAuthorized } from "../../../Util/Auth";

import itemSelectImg from "../../../Assets/arts/pfdetails.jpg"
import folderImg from "../../../Assets/icons/PersonalFolder/Folder.png"
import linkImg from "../../../Assets/icons/PersonalFolder/Link.png"
import noteImg from "../../../Assets/icons/PersonalFolder/note.png"
import videoImg from "../../../Assets/icons/PersonalFolder/video.png"
import fileImg from "../../../Assets/icons/PersonalFolder/file.png"

const ContentDetails = ({currentChat, selectedContent, otherUsers, socket, showMemberboxMenu}) => {

    if(!selectedContent.type){
        return ( 
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                <div className="bottom">
                    <div className="chat-details chat-not-selected">
                        <img src={itemSelectImg} />
                        <div className="chat-details-text">
                            Select a File or a Folder to see its details
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [_, time] = getTimeDate(selectedContent.content.createdOn)
    const date = getDate(selectedContent.content.createdOn)

    if(selectedContent.type === "dir"){

        const data = {
            name: selectedContent.content.name,
            createdOn: date + " at " + time,
            numSubDirs: selectedContent.content.subDirs.length || 0,
            numNotes: selectedContent.content.notes.length || 0,
            numVideos: selectedContent.content.videos.length || 0,
            numLinks: selectedContent.content.links.length || 0,
            numFiles: selectedContent.content.files.length || 0,
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                {/* <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} /> */}
                <div className="bottom">
                    <div className="content-details">
                        <div className="content-details-top">
                            <div className="icon"><img src={folderImg} /></div>
                            <div className="content-details-row name">
                                {data.name}
                            </div>
                        </div>
                        <div className="content-details-bottom">
                            <dl className="content-details-column">
                                <dt>Created On</dt>
                                <dd>
                                    <div>{data.createdOn}</div>
                                </dd>
                            </dl>
                            <div className="title">Content details</div>
                            <dl className="content-details-row description">
                                <dt>Sub Directories</dt>
                                <dd>
                                    <div>{data.numSubDirs}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-row description">
                                <dt>Notes</dt>
                                <dd>
                                    <div>{data.numNotes}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-row description">
                                <dt>Videos</dt>
                                <dd>
                                    <div>{data.numVideos}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-row description">
                                <dt>Links</dt>
                                <dd>
                                    <div>{data.numLinks}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-row description">
                                <dt>Files</dt>
                                <dd>
                                    <div>{data.numFiles}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );    
    }else if(selectedContent.type === "file"){
        
        const data = {
            name: selectedContent.content.name,
            createdOn: date + " at " + time,
            description: selectedContent.content.description,
            fileType: selectedContent.content.fileType,
            visibility: selectedContent.content.visibility,
            sharedWith: selectedContent.content.sharedWith,
            lisence: selectedContent.content.lisence,
            tags: selectedContent.content.tags,
            author: selectedContent.content.author,
            authorName: selectedContent.content.authorName,
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                {/* <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} /> */}
                <div className="bottom">
                    <div className="content-details">
                        <div className="content-details-top">
                            <div className="icon"><img src={fileImg} /></div>
                            <div className="content-details-row name">
                                {data.name}
                            </div>
                        </div>
                        <div className="content-details-bottom">
                            <dl className="content-details-column">
                                <dt className="large">Created On</dt>
                                <dd>
                                    <div>{data.createdOn}</div>
                                </dd>
                            </dl>
                            <div className="title">File details</div>
                            <dl className="content-details-column description">
                                <dt>description</dt>
                                <dd>
                                    <div>{data.description}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>File Type</dt>
                                <dd>
                                    <div>{data.fileType}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>visibility</dt>
                                <dd>
                                    <div>{data.visibility}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>lisence</dt>
                                <dd>
                                    <div>{data.lisence}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Tags</dt>
                                <dd>
                                    <div className="tags-container">
                                        {data.tags && data.tags.map(tag=>{
                                            return (
                                                <div className="tag">
                                                    {tag}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Author</dt>
                                <dd>
                                    <div>{data.author}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Author Name</dt>
                                <dd>
                                    <div>{data.authorName}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }else if(selectedContent.type === "link"){
        
        const data = {
            name: selectedContent.content.name,
            createdOn: date + " at " + time,
            description: selectedContent.content.description,
            link: selectedContent.content.link,
            isPublic: selectedContent.content.isPublic,
            lisence: selectedContent.content.lisence,
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                {/* <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} /> */}
                <div className="bottom">
                    <div className="content-details">
                        <div className="content-details-top">
                            <div className="icon"><img src={linkImg} /></div>
                            <div className="content-details-row name">
                                {data.name}
                            </div>
                        </div>
                        <div className="content-details-bottom">
                            <dl className="content-details-column">
                                <dt className="large">Created On</dt>
                                <dd>
                                    <div>{data.createdOn}</div>
                                </dd>
                            </dl>
                            <div className="title">Link details</div>
                            <dl className="content-details-column description">
                                <dt>description</dt>
                                <dd>
                                    <div>{data.description}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Link</dt>
                                <dd>
                                    <div>{data.link}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>visibility</dt>
                                <dd>
                                    <div>{data.isPublic}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>lisence</dt>
                                <dd>
                                    <div>{data.lisence}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }else if(selectedContent.type === "video"){
        
        const data = {
            name: selectedContent.content.name,
            createdOn: date + " at " + time,
            description: selectedContent.content.description,
            link: selectedContent.content.link,
            isPublic: selectedContent.content.isPublic,
            lisence: selectedContent.content.lisence,
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                {/* <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} /> */}
                <div className="bottom">
                    <div className="content-details">
                        <div className="content-details-top">
                            <div className="icon"><img src={videoImg} /></div>
                            <div className="content-details-row name">
                                {data.name}
                            </div>
                        </div>
                        <div className="content-details-bottom">
                            <dl className="content-details-column">
                                <dt className="large">Created On</dt>
                                <dd>
                                    <div>{data.createdOn}</div>
                                </dd>
                            </dl>
                            <div className="title">Link details</div>
                            <dl className="content-details-column description">
                                <dt>description</dt>
                                <dd>
                                    <div>{data.description}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Link</dt>
                                <dd>
                                    <div>{data.link}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>visibility</dt>
                                <dd>
                                    <div>{data.isPublic}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>lisence</dt>
                                <dd>
                                    <div>{data.lisence}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }else if(selectedContent.type === "note"){
        
        const data = {
            name: selectedContent.content.name,
            createdOn: date + " at " + time,
            description: selectedContent.content.description,
            visibility: selectedContent.content.visibility,
            sharedWith: selectedContent.content.sharedWith,
            lisence: selectedContent.content.lisence,
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                {/* <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} /> */}
                <div className="bottom">
                    <div className="content-details">
                        <div className="content-details-top">
                            <div className="icon"><img src={noteImg} /></div>
                            <div className="content-details-row name">
                                {data.name}
                            </div>
                        </div>
                        <div className="content-details-bottom">
                            <dl className="content-details-column">
                                <dt className="large">Created On</dt>
                                <dd>
                                    <div>{data.createdOn}</div>
                                </dd>
                            </dl>
                            <div className="title">Note details</div>
                            <dl className="content-details-column description">
                                <dt>description</dt>
                                <dd>
                                    <div>{data.description}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Visibility</dt>
                                <dd>
                                    <div>{data.visibility}</div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>Shared with</dt>
                                <dd>
                                    <div className="tags-container">
                                        {data.sharedWith && data.sharedWith.map(user=>{
                                            return (
                                                <div className="tag">
                                                    {user}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </dd>
                            </dl>
                            <dl className="content-details-column description">
                                <dt>lisence</dt>
                                <dd>
                                    <div>{data.lisence}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }else{
        console.log("pf type : ", selectedContent.type)
        return (
            <div>Unknown type</div>
        );
    }
}

 
export default ContentDetails;