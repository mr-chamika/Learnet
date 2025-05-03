import { useContext, useEffect, useState } from "../../../react_lite/createDOM"
import tstImg from "../../Assets/grp.jpg"
import { FriendsContext } from "../../Contexts/FriendsContext"
import { otherUsersContext } from "../../Contexts/OtherUsersContext"
import { UserContext } from "../../Contexts/UserContext"

const FriendCard = ({friendId, isRequest, isSent}) => {

    const {user} = useContext(UserContext)
    const {users: otherUsers} = useContext(otherUsersContext)
    const {friendsDispatcher} = useContext(FriendsContext)
    const [requestSent, setRequestSent] = useState(false)

    useEffect(()=>{
        setRequestSent(isSent)
    }, [isSent])

    const acceptHandler = () =>{
        fetch("http://localhost:8080/friends/accept-request", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                id: friendId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                alert(JSON.stringify(data))
                friendsDispatcher({type: "accept", payload: friendId})
            }
        })
    }

    const rejectHandler = () =>{
        fetch("http://localhost:8080/friends/reject-request", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                id: friendId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                alert(JSON.stringify(data))
                friendsDispatcher({type: "reject", payload: friendId})
            }
        })
    }

    const sendRequestHandler = () =>{
        fetch("http://localhost:8080/friends/send-request", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                id: friendId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                alert(JSON.stringify(data))
                friendsDispatcher({type: "send", payload: friendId})
                // setRequestSent(true)
            }
        })
    }

    const cancelRequestHandler = () =>{
        fetch("http://localhost:8080/friends/cancel-request", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                id: friendId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                alert(JSON.stringify(data))
                friendsDispatcher({type: "cancel", payload: friendId})
                // setRequestSent(false)
            }
        })
    }

    const data = otherUsers[friendId]

    if(!data){
        return (
            <div>
                Loading...
            </div>
        );
    }

    return ( 
        <div className="friend-card">
            <div className="friend-card-left">
                <div className="profile-picture">
                    <img src={tstImg} />
                </div>
                <div className="details">
                    <div className="name">{data.name}</div>
                    <div className="university">{data.university}</div>
                </div>
            </div>
            {
                isRequest ? (
                    <div className="controlls">
                        <button className="icon-button" onClick={acceptHandler}>Accept</button>
                        <button className="icon-button" onClick={rejectHandler}>Reject</button>
                    </div>
                ) : (
                    <div className="controlls">
                        {requestSent ? (
                            <button className="icon-button" onClick={cancelRequestHandler}>Cancel Request</button>
                        ) : (
                            <button className="icon-button" onClick={sendRequestHandler}>Add Friend</button>
                        )}
                    </div>
                )
            }
        </div>
     );
}
 
export default FriendCard;