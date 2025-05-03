import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { FriendsContext } from "../../Contexts/FriendsContext";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import "./FriendSelectionBox.css"

import tstImg from "../../Assets/grp.jpg"

const FriendSelectionBox = ({allowMultiple = false, max=20, inputName = "selected-users"}) => {

    // TODO
    // 3 Options
    // using email
    // a friend
    // user search

    const {friends} = useContext(FriendsContext)
    const {users, fetchUsersIfNotExist} = useContext(otherUsersContext)
    const [count, setCount] = useState(0)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [disabled, setDisabled] = useState(false)

    const searchHandler = () => {
        
    }

    const selectHandler = (friendId) => {
        // console.log("selecting user: ", disabled)
        if(!disabled){
            if(!allowMultiple){
                setSelectedUsers(prev=>[friendId])
                setCount(1)
            }else{
                setSelectedUsers(prev=>{
                    const updated = [...prev, friendId]
                    if(updated.length >= max){
                        setDisabled(true)
                    }
                    setCount(prev=>prev+1)
                    return updated
                })
            }
        }
    }

    const deselectHandler = (friendId) => {
        if(!allowMultiple){
            setSelectedUsers([])
            setCount(0)
        }else{
            setSelectedUsers(prev=>{
                const x = prev.filter(v=>v!=friendId)
                if(prev.length > x.length){
                    setCount(prev=>prev-1)
                }
                return [...x]
            })
        }
    }


    useEffect(()=>{
        // const x = friends?.slice(0, count)
        // console.log("users to fetch : ", x)
        // if(x){
        //     fetchUsersIfNotExist(x)
        // }
        fetchUsersIfNotExist(friends)
    }, [friends])

    // let loadedFriends = friends?.slice(0, count)
    const loadedFriends = friends?.filter(friendId=>{
        if(selectedUsers.indexOf(friendId) >= 0){
            return false
        }
        return true
    }).filter(friendId=>{
        const user = users[friendId]
        if(user && user?.name?.includes(searchValue)){
            return true
        }
        return false
    })

    // console.log("selected Users: ", selectedUsers, loadedFriends, users)

    return ( 
        <div className="friend-selection-box">
            <input hidden={true} name={inputName} value={JSON.stringify(selectedUsers)}/>
            {allowMultiple ? (
                <div className="title">Selected users</div>
            ) : (
                <div className="title">Selected user</div>
            )}
            <div>max allowed : {max} &nbsp;&nbsp; selected : {count}</div>
            <div className="selected-users">
                {selectedUsers && selectedUsers.map((friendId, index)=>{
                    return (
                        <FriendBox friendId={friendId} onClick={deselectHandler} key={index}/>
                    )
                })}
            </div>
            <div className="title">Friends</div>
            <div className="form">
                <input name="search" value={searchValue} placeholder="Search friends" onInput={(e)=>setSearchValue(e.target.value)}/>
                {/* <button onClick={searchHandler}>Search</button> */}
            </div>
            <div className={`scroll ${disabled ? "disabled" : ""}`}>
                {loadedFriends && loadedFriends.map((friendId, index)=>{
                    return (
                        <FriendBox friendId={friendId} onClick={selectHandler} key={index}/>
                    )
                })}
            </div>
        </div>
     );
}

const FriendBox = ({friendId, onClick}) => {
    const {users} = useContext(otherUsersContext)
    const friendData = users[friendId]

    if(!friendData){
        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    return (
        <div className="friend-box" onClick={()=>onClick(friendId)}>
            <div className="friend-profile-picture">
                <img src={tstImg} />
            </div>
            <div className="friend-name">
                {friendData.name}
            </div>
        </div>
    );
}
 
export default FriendSelectionBox;