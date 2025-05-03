import "./ChatDetails.css"

import { useContext, useEffect, useState } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import tstImg from "../../../Assets/grp.jpg"
import editIcon from "../../../Assets/icons/edit.svg"
import MemberBox from "./MemberBox";
import { formDataToObj } from "../../../Util/FormDataToObj";
import { getDate } from "../../../Util/TimeDate";
import { isAuthorized } from "../../../Util/Auth";
import chatdetailsImg from "../../../Assets/arts/pfdetails.jpg"
import { otherUsersContext } from "../../../Contexts/OtherUsersContext";

const ChatDetails = ({currentChat, otherUsers, socket, showMemberboxMenu, onAddMembersClick}) => {

    if(!currentChat){
        return ( 
            <div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                <div className="bottom">
                    <div className="chat-details chat-not-selected">
                        <img src={chatdetailsImg} />
                        <div className="chat-details-text">
                            Select a Community, Group or Chat to see its details
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if(currentChat.type === "chat"){
        return (
            <div className="details-pannel">
                <div className="topbar">
                    <div className="left">
                        <span className={`tab-button`} >Details</span>
                    </div>
                </div>
                <PrivateChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} />
            </div>
        );    
    }

    if(currentChat.type === "group" && currentChat.chat.requestToJoin){

        const data = {
            name: currentChat.chat.name,
            description: currentChat.chat.description,
            at: getDate(currentChat.chat.createdAt),
            owner: otherUsers[currentChat?.chat.createdBy]?.name,
            visibility: currentChat.chat.visibility
        }

        return (
            <div className="details-pannel">
                <div className="topbar">
                    <div className="left">
                        <span className={`tab-button`} >Details</span>
                    </div>
                </div>
                <div className="bottom">
                    <div className="chat-details">
                        <div className="chat-details-top">
                            <div className="profile"><img src={tstImg} /></div>
                                <div className="chat-details-row">
                                    <span className="name">{data.name}</span>
                                </div>
                            </div>
                        <div className="chat-details-bottom">
                            <dl className="chat-details-column description">
                                <dt>Description</dt>
                                <dd>
                                    <div>
                                        <span>{data.description}</span>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="created-on">
                                <dt>Created on</dt>
                                <dd>{data.at}</dd>
                            </dl>
                            <dl className="owner">
                                <dt>Owner</dt>
                                <dd>{data.owner}</dd>
                            </dl>
                            <dl className="owner">
                                <dt>Visibility</dt>
                                <dd>
                                    <div className="chat-details-row">
                                        <span>{data.visibility}</span>
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [currentTab, setCurrentTab] = useState("Details")

    return (
        <div className="details-pannel">
            <div className="topbar">
                <div className="left">
                    <span className={`tab-button ${currentTab === "Details" ? "active" : ""}`} onClick={()=>setCurrentTab("Details")}>Details</span>
                    <span className={`tab-button ${currentTab === "Members" ? "active" : ""}`} onClick={()=>setCurrentTab("Members")}>Members</span>
                </div>
            </div>
            {
                currentTab === "Details" ? 
                (<ChatDetailsInfo currentChat={currentChat} otherUsers={otherUsers} socket={socket}/>) 
                : 
                (<ChatDetailsMembers currentChat={currentChat} otherUsers={otherUsers} socket={socket} showMemberboxMenu={showMemberboxMenu} onAddMembersClick={onAddMembersClick}/>) 
            }
        </div>
     );
}

const ChatDetailsInfo = ({currentChat, otherUsers, socket}) => {

    const {user} = useContext(UserContext)

    const permissionTypes = {
        "owner-only": "Owner Only",
        "admins-only": "Admins Only",
        "members-only": "Members Only"
    }

    const [currentlyEditing, setCurrentlyEditing] = useState({
        name: false,
        description: false,
        visibility: false,
        addMembers: false,
        removeMembers: false,
        addAdmins: false,
        removeAdmins: false,
        editGroupInfo: false,
        editGroupSettings: false,
        sendMessages: false
    })

    const [data, setData] = useState({})

    useEffect(()=>{
        if(currentChat?.type === "group"){
            const isOwner = user.userId == currentChat?.chat.createdBy
            const isAdmin = currentChat?.chat.admins.findIndex(admin => admin === user.userId) >= 0
            setData({
                name: currentChat?.chat.name,
                owner: isOwner ? "You" : otherUsers[currentChat?.chat.createdBy]?.name,
                isOwner,
                isAdmin,
                userPermissionLevel: isOwner ? "owner-only" : isAdmin ? "admin-only" : "members-only",
                description: currentChat?.chat.description,
                createdAt: currentChat?.chat.createdAt,
                visibility: currentChat?.chat.visibility,
                addMembers: currentChat?.chat.permissions.addMembers,
                removeMembers: currentChat?.chat.permissions.removeMembers,
                addAdmins: currentChat?.chat.permissions.addAdmins,
                removeAdmins: currentChat?.chat.permissions.removeAdmins,
                editGroupInfo: currentChat?.chat.permissions.editGroupInfo,
                editGroupSettings: currentChat?.chat.permissions.editGroupInfo,
                sendMessages: currentChat?.chat.permissions.sendMessages,
                members: currentChat?.chat.members.map(member => {
                    return otherUsers[member]
                }),
                canChangeGroupInfo: isAuthorized(data.userPermissionLevel, data.editGroupInfo)
            })
        }else if(currentChat?.type === "community"){
            const isOwner = user.userId == currentChat?.chat.createdBy
            console.log("is owner : ", isOwner)
            const isAdmin = currentChat?.chat.admins.findIndex(admin => admin === user.userId) >= 0
            console.log("i : ", isOwner ? "owner-only" : isAdmin ? "admin-only" : "members-only")
            const membersSet = new Set()
            
            currentChat.chat.members.forEach(memberId => {
                const user = otherUsers[memberId]
                user.position = "Member"
                membersSet.add(user)
            })
            currentChat.chat.admins.forEach(adminId => {
                const user = otherUsers[adminId]
                user.position = "Admin"
                membersSet.add(user)
            })
            const owner = otherUsers[currentChat.chat.createdBy]
            owner.position = "Owner"
            membersSet.add(owner)
            
            setData({
                name: currentChat?.chat.name,
                owner: isOwner ? "You" : otherUsers[currentChat?.chat.createdBy]?.name,
                isOwner,
                isAdmin,
                userPermissionLevel: isOwner ? "owner-only" : isAdmin ? "admin-only" : "members-only",
                description: currentChat?.chat.description,
                createdAt: currentChat?.chat.createdAt,
                visibility: currentChat?.chat.visibility,
                addMembers: currentChat?.chat.permissions.addMembers,
                removeMembers: currentChat?.chat.permissions.removeMembers,
                addAdmins: currentChat?.chat.permissions.addAdmins,
                removeAdmins: currentChat?.chat.permissions.removeAdmins,
                editCommunityInfo: currentChat?.chat.permissions.editCommunityInfo,
                editGroupSettings: currentChat?.chat.permissions.editCommunityInfo,
                sendMessages: currentChat?.chat.permissions.sendMessages,
                members: Array(...membersSet),
                canChangeGroupInfo: isAuthorized(data.userPermissionLevel, data.editGroupInfo)
            })
            console.log("currentChat: ", currentChat)
        }else{
            const friendId = currentChat.chat.userId1 === user.userId ? currentChat.chat.userId2 : currentChat.chat.userId1
            setData({
                name: otherUsers[friendId].name
            })
        }
    }, [currentChat])
    // console.log("user : ", otherUsers["6753d5b520a22433db03559e"], user)
    // console.log("cur chat : ", currentChat)

    const eidtHandler = (key) => {
        setCurrentlyEditing(prev=>{
            prev[key] = true
            return {...prev}
        })     
    }

    // console.log("permissions : ", data.addMembers, data.removeMembers)

    const saveHandler = (key, e) => {
        // console.log("data : ", data)
        const form = new FormData(e.target)
        const dataObj = formDataToObj(form)

        socket.send(JSON.stringify({
            type: `change-${currentChat.type}-${key}`,
            data: {
                [`${currentChat.type}Id`]: currentChat?.chat._id,
                updatedData: dataObj
            }
        }))

        setCurrentlyEditing(prev=>{
            prev[key] = false
            return {...prev}
        })
    }

    const updateHandler = (e) => {
        // console.log(e.target.value)
        setData(prev=>{
            prev[e.target.name] = e.target.value
            return prev
        })
    }

    const saveName = (e) =>saveHandler("name", e)
    const saveDescription = (e) =>saveHandler("description", e)
    const saveVisibility = (e) =>saveHandler("visibility", e)
    const savePermissions = (e) =>saveHandler("permissions", e)

    // console.log("userPermissionLevel: ", data.userPermissionLevel, data.editGroupInfo)
    // console.log("authorizationIndex(data?.userPermissionLevel) <= authorizationIndex(data?.editGroupInfo): ", authorizationIndex(data?.userPermissionLevel), authorizationIndex(data?.editGroupInfo))
    const at = getDate(data.createdAt)
    // console.log("prefd check : ", authorizationIndex(data?.userPermissionLevel), authorizationIndex(data?.editGroupInfo), authorizationIndex(data?.userPermissionLevel) <= authorizationIndex(data?.editGroupInfo), data?.editGroupInfo)

    return (
        <div className="bottom">
            <div className="chat-details">
                <div className="chat-details-top">
                    <div className="profile"><img src={tstImg} /></div>
                    {!currentlyEditing.name ? (
                        <div className="chat-details-row">
                            <span className="name">{data.name}</span>
                            {data.canChangeGroupInfo && (
                                <button className="collapse-icon-button" type="button" name="name" onClick={()=>eidtHandler("name")} value="Edit">
                                    <img src={editIcon} />
                                </button>
                            )}
                        </div>
                    ):
                    (
                        <form className="name" onSubmit={saveName}>
                            <input name="name" type="text" value={data.name} onChange={updateHandler}/>
                            <button>Save</button>
                        </form>
                    )}
                </div>
                <div className="chat-details-bottom">
                    <dl className="chat-details-column description">
                        <dt>Description</dt>
                        <dd>
                            <div>
                            {!currentlyEditing.description && (
                                <span>{data.description}</span>
                            )}
                            {!currentlyEditing.description && data.canChangeGroupInfo && (
                                <button className="collapse-icon-button" type="button" name="description" onClick={()=>eidtHandler("description")} value="Edit">
                                    <img src={editIcon} />
                                </button>
                            )}
                            </div>
                            {currentlyEditing.description && (
                                <form className="description" onSubmit={saveDescription}>
                                    <input name="description" type="text" value={data.description} onChange={updateHandler}/>
                                    <button>Save</button>
                                </form>
                            )}
                        </dd>
                    </dl>
                    <dl className="created-on">
                        <dt>Created on</dt>
                        <dd>{at}</dd>
                    </dl>
                    <dl className="owner">
                        <dt>Owner</dt>
                        <dd>{data.owner}</dd>
                    </dl>
                    <dl className="owner">
                        <dt>Visibility</dt>
                        <dd>
                            <div className="chat-details-row">
                                {!currentlyEditing.visibility && (
                                    <span>{data.visibility}</span>
                                )}
                                {!currentlyEditing.visibility && data.isOwner && (
                                    <button className="collapse-icon-button" type="button" name="visibility" onClick={()=>eidtHandler("visibility")} value="Edit">
                                        <img src={editIcon} />
                                    </button>
                                )}
                            </div>
                            {currentlyEditing.visibility && (
                                <form className="visibility" onSubmit={saveVisibility}>
                                    <select name="visibility" onChange={updateHandler}>
                                        <option selected={data.visibility === "PRIVATE" ? true : false}>PRIVATE</option>
                                        <option selected={data.visibility === "PUBLIC" ? true : false}>PUBLIC</option>
                                    </select>
                                    <button>Save</button>
                                </form>
                            )}
                        </dd>
                    </dl>
                    <dl className="owner">
                        <dt className="chat-details-row margin-bottom">
                            <span>Permissions</span>
                            {!currentlyEditing.permissions && data.isOwner && (
                                <button className="collapse-icon-button" type="button" name="permissions" onClick={()=>eidtHandler("permissions")} value="Edit">
                                    <img src={editIcon} />
                                </button>
                            )}
                        </dt>
                        <dd>
                            {!currentlyEditing.permissions && (
                                <div className="chat-details-padding">
                                    <dl className="chat-details-row justify">
                                        <dt>Add members</dt>
                                        <dd>{data.addMembers}</dd>
                                    </dl>
                                    <dl className="chat-details-row justify">
                                        <dt>Remove members</dt>
                                        <dd>{data.removeMembers}</dd>
                                    </dl>
                                    <dl className="chat-details-row justify">
                                        <dt>Add admins</dt>
                                        <dd>{data.addAdmins}</dd>
                                    </dl>
                                    <dl className="chat-details-row justify">
                                        <dt>Add admins</dt>
                                        <dd>{data.removeAdmins}</dd>
                                    </dl>
                                    <dl className="chat-details-row justify">
                                        <dt>Edit group info</dt>
                                        <dd>{data.editGroupInfo}</dd>
                                    </dl>
                                    <dl className="chat-details-row justify">
                                        <dt>Send messages</dt>
                                        <dd>{data.sendMessages}</dd>
                                    </dl>
                                </div>
                            )}
                            {currentlyEditing.permissions && (
                                <form className="permissions" onSubmit={savePermissions}>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Add members</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="addMembers" value={data.addMembers} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.addMembers === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.addMembers === "admins-only" ? true : false}>Admins Only</option>
                                                <option value="members-only" selected={data.addMembers === "members-only" ? true : false}>Members Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Remove members</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="removeMembers" value={data.removeMembers} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.removeMembers === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.removeMembers === "admins-only" ? true : false}>Admins Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Add admins</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="addAdmins" value={data.addAdmins} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.addAdmins === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.addAdmins === "admins-only" ? true : false}>Admins Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Remove admins</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="removeAdmins" value={data.removeAdmins} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.removeAdmins === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.removeAdmins === "admins-only" ? true : false}>Admins Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Edit group info</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="editGroupInfo" value={data.editGroupInfo} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.editGroupInfo === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.editGroupInfo === "admins-only" ? true : false}>Admins Only</option>
                                                <option value="members-only" selected={data.editGroupInfo === "members-only" ? true : false}>Members Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Send messages</label>
                                        </dt>
                                        <dd className="input">
                                            <select name="sendMessages" value={data.sendMessages} onChange={updateHandler}>
                                                <option value="owner-only" selected={data.sendMessages === "owner-only" ? true : false}>Owner Only</option>
                                                <option value="admins-only" selected={data.sendMessages === "admins-only" ? true : false}>Admins Only</option>
                                                <option value="members-only" selected={data.sendMessages === "members-only" ? true : false}>Members Only</option>
                                            </select>
                                            {/* <div className="message">Provide a proper name to make it easy to find. Make it brief</div> */}
                                        </dd>
                                    </dl>
                                    <button>Save</button>
                                </form>
                            )}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}

const ChatDetailsMembers = ({currentChat, otherUsers, socket, showMemberboxMenu, onAddMembersClick}) => {

    const {user} = useContext(UserContext)

    const [currentlyEditing, setCurrentlyEditing] = useState({
        name: false,
        description: false,
        visibility: false,
        addMembers: false,
        removeMembers: false,
        addAdmins: false,
        removeAdmins: false,
        editGroupInfo: false,
        editGroupSettings: false,
        sendMessages: false
    })

    const [data, setData] = useState({})

    useEffect(()=>{
        if(currentChat?.type === "group"){
            const isOwner = user.userId == currentChat?.chat.createdBy
            const isAdmin = currentChat?.chat.admins.findIndex(admin => admin === user.userId) >= 0
            const membersSet = new Set()
            currentChat.chat.members.forEach(memberId => {
                const user = otherUsers[memberId]
                user.position = "Member"
                membersSet.add(user)
            })
            currentChat.chat.admins.forEach(adminId => {
                const user = otherUsers[adminId]
                user.position = "Admin"
                membersSet.add(user)
            })
            const owner = otherUsers[currentChat.chat.createdBy]
            owner.position = "Owner"
            membersSet.add(owner)
            setData({
                name: currentChat?.chat.name,
                owner: isOwner ? "You" : otherUsers[currentChat?.chat.createdBy]?.name,
                isOwner,
                isAdmin,
                userPermissionLevel: isOwner ? "owner-only" : isAdmin ? "admin-only" : "members-only",
                description: currentChat?.chat.description,
                createdAt: currentChat?.chat.createdAt,
                visibility: currentChat?.chat.visibility,
                addMembers: currentChat?.chat.permissions.addMembers,
                removeMembers: currentChat?.chat.permissions.removeMembers,
                addAdmins: currentChat?.chat.permissions.addAdmins,
                removeAdmins: currentChat?.chat.permissions.removeAdmins,
                editGroupInfo: currentChat?.chat.permissions.editGroupInfo,
                editGroupSettings: currentChat?.chat.permissions.editGroupInfo,
                sendMessages: currentChat?.chat.permissions.sendMessages,
                members: Array(...membersSet),
                canChangeGroupInfo: isAuthorized(data.userPermissionLevel, data.editGroupInfo)
            })
        }else if(currentChat?.type === "community"){
            const isOwner = user.userId == currentChat?.chat.createdBy
            const isAdmin = currentChat?.chat.admins.findIndex(admin => admin === user.userId) >= 0
            const membersSet = new Set()
            
            currentChat.chat.members.forEach(memberId => {
                const user = otherUsers[memberId]
                user.position = "Member"
                membersSet.add(user)
            })
            currentChat.chat.admins.forEach(adminId => {
                const user = otherUsers[adminId]
                user.position = "Admin"
                membersSet.add(user)
            })
            const owner = otherUsers[currentChat.chat.createdBy]
            owner.position = "Owner"
            membersSet.add(owner)
            
            setData({
                name: currentChat?.chat.name,
                owner: isOwner ? "You" : otherUsers[currentChat?.chat.createdBy]?.name,
                isOwner,
                isAdmin,
                userPermissionLevel: isOwner ? "owner-only" : isAdmin ? "admin-only" : "members-only",
                description: currentChat?.chat.description,
                createdAt: currentChat?.chat.createdAt,
                visibility: currentChat?.chat.visibility,
                addMembers: currentChat?.chat.permissions.addMembers,
                removeMembers: currentChat?.chat.permissions.removeMembers,
                addAdmins: currentChat?.chat.permissions.addAdmins,
                removeAdmins: currentChat?.chat.permissions.removeAdmins,
                editCommunityInfo: currentChat?.chat.permissions.editCommunityInfo,
                editGroupSettings: currentChat?.chat.permissions.editCommunityInfo,
                sendMessages: currentChat?.chat.permissions.sendMessages,
                members: Array(...membersSet),
                canChangeGroupInfo: isAuthorized(data.userPermissionLevel, data.editGroupInfo)
            })
            console.log("currentChat: ", currentChat)
        }else{
            const friendId = currentChat.chat.userId1 === user.userId ? currentChat.chat.userId2 : currentChat.chat.userId1
            setData({
                name: otherUsers[friendId].name
            })
        }
    }, [currentChat])

    const eidtHandler = (key) => {
        setCurrentlyEditing(prev=>{
            prev[key] = true
            return {...prev}
        })     
    }

    const saveHandler = (key, e) => {
        const form = new FormData(e.target)
        const dataObj = formDataToObj(form)

        socket.send(JSON.stringify({
            type: `change-${currentChat.type}-${key}`,
            data: {
                [`${currentChat.type}Id`]: currentChat?.chat._id,
                updatedData: dataObj
            }
        }))

        setCurrentlyEditing(prev=>{
            prev[key] = false
            return {...prev}
        })
    }

    const updateHandler = (e) => {
        setData(prev=>{
            prev[e.target.name] = e.target.value
            return prev
        })
    }

    const saveName = (e) =>saveHandler("name", e)

    const at = getDate(data.createdAt)

    return (
        <div className="bottom">
            <div className="chat-details">
                <div className="chat-details-top">
                    <div className="profile"><img src={tstImg} /></div>
                    {!currentlyEditing.name ? (
                        <div className="chat-details-row">
                            <span className="name">{data.name}</span>
                            {data.canChangeGroupInfo && (
                                <button className="collapse-icon-button" type="button" name="name" onClick={()=>eidtHandler("name")} value="Edit">
                                    <img src={editIcon} />
                                </button>
                            )}
                        </div>
                    ):
                    (
                        <form className="name" onSubmit={saveName}>
                            <input name="name" type="text" value={data.name} onChange={updateHandler}/>
                            <button>Save</button>
                        </form>
                    )}
                </div>
                <div className="chat-details-bottom">
                    <dl className="chat-details-column">
                        <dt>
                            <span>Members</span>
                            <button className="icon-button small" onClick={onAddMembersClick}>Add members</button>
                        </dt>
                        <dd>
                            {
                                data.members && data.members.map((member, index)=>{
                                    return (
                                        <MemberBox member={member} key={index} showMemberboxMenu={showMemberboxMenu}/>
                                    )
                                })
                            }
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}

const PrivateChatDetails = ({currentChat, otherUsers, socket}) => {
    const {user} = useContext(UserContext)
    const {fetchUsersIfNotExist} = useContext(otherUsersContext)

    const [currentlyEditing, setCurrentlyEditing] = useState({
        name: false,
        description: false,
        visibility: false,
        addMembers: false,
        removeMembers: false,
        addAdmins: false,
        removeAdmins: false,
        editGroupInfo: false,
        editGroupSettings: false,
        sendMessages: false
    })

    const [data, setData] = useState({})

    useEffect(()=>{
        const friendId = currentChat.chat.userId1 === user.userId ? currentChat.chat.userId2 : currentChat.chat.userId1
        fetchUsersIfNotExist([friendId])
        setData({
            name: otherUsers[friendId]?.name,
            bio: otherUsers[friendId]?.bio
        })
    }, [currentChat])

    const eidtHandler = (key) => {
        setCurrentlyEditing(prev=>{
            prev[key] = true
            return {...prev}
        })     
    }

    const saveHandler = (key, e) => {
        const form = new FormData(e.target)
        const dataObj = formDataToObj(form)

        socket.send(JSON.stringify({
            type: `change-${currentChat.type}-${key}`,
            data: {
                [`${currentChat.type}Id`]: currentChat?.chat._id,
                updatedData: dataObj
            }
        }))

        setCurrentlyEditing(prev=>{
            prev[key] = false
            return {...prev}
        })
    }

    const updateHandler = (e) => {
        setData(prev=>{
            prev[e.target.name] = e.target.value
            return prev
        })
    }

    const saveName = (e) =>saveHandler("name", e)
    const saveDescription = (e) =>saveHandler("description", e)
    const saveVisibility = (e) =>saveHandler("visibility", e)
    const savePermissions = (e) =>saveHandler("permissions", e)

    const at = getDate(data.createdAt)

    return (
        <div className="bottom">
            <div className="chat-details">
                <div className="chat-details-top">
                    <div className="profile"><img src={tstImg} /></div>
                    <div className="chat-details-row">
                        <span className="name">{data.name}</span>
                    </div>
                </div>
                <div className="chat-details-bottom">
                    <dl className="chat-details-column description">
                        <dt>Bio</dt>
                        <dd>
                            <div>{data.bio}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}
 
export default ChatDetails;