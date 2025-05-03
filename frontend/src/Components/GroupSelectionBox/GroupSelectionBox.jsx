import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { FriendsContext } from "../../Contexts/FriendsContext";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import "./GroupSelectionBox.css"

import tstImg from "../../Assets/grp.jpg"

const GroupSelectionBox = ({groups, allowMultiple = false, max=20, inputName = "selected-groups"}) => {

    const [count, setCount] = useState(0)
    const [selectedGroups, setSelectedGroups] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [disabled, setDisabled] = useState(false)

    const searchHandler = () => {
        
    }

    const selectHandler = (group) => {
        if(!disabled){
            if(!allowMultiple){
                setSelectedGroups(group)
                setCount(1)
            }else{
                setSelectedGroups(prev=>{
                    const updated = [...prev, group]
                    if(updated.length >= max){
                        setDisabled(true)
                    }
                    setCount(prev=>prev+1)
                    return updated
                })
            }
        }
    }

    const deselectHandler = (group) => {
        if(!allowMultiple){
            setSelectedGroups([])
            setCount(0)
        }else{
            setSelectedGroups(prev=>{
                const x = prev.filter(g=>g._id!=group._id)
                if(prev.length > x.length){
                    setCount(prev=>prev-1)
                }
                return [...x]
            })
        }
    }

    const filteredGroups = groups?.filter(group=>{
        if(
            group.name.includes(searchValue) &&
            !group.name.includes("Announcement") &&
            !group.name.includes("General")
        ){
            return true
        }
        return false
    }).filter(group=>{
        if(selectedGroups.find(g => g._id === group._id)){
            return false
        }
        return true
    })

    return ( 
        <div className="group-selection-box">
            <input hidden={true} name={inputName} value={JSON.stringify(selectedGroups.map(v=>v._id))}/>
            {allowMultiple ? (
                <div className="title">Selected Groups</div>
            ) : (
                <div className="title">Selected group</div>
            )}
            <div>max allowed : {max} &nbsp;&nbsp; selected : {count}</div>
            <div className="selected-users">
                {selectedGroups && selectedGroups.map((group, index)=>{
                    return (
                        <GroupBox group={group} onClick={deselectHandler} key={index}/>
                    )
                })}
            </div>
            <div className="title">Groups</div>
            <div className="form">
                <input name="search" value={searchValue} placeholder="Search friends" onInput={(e)=>setSearchValue(e.target.value)}/>
                {/* <button onClick={searchHandler}>Search</button> */}
            </div>
            <div className={`scroll ${disabled ? "disabled" : ""}`}>
                {filteredGroups && filteredGroups.map((group, index)=>{
                    return (
                        <GroupBox group={group} onClick={selectHandler} key={index}/>
                    )
                })}
            </div>
        </div>
     );
}

const GroupBox = ({group, onClick}) => {
    return (
        <div className="group-box" onClick={()=>onClick(group)}>
            <div className="group-profile-picture">
                <img src={tstImg} />
            </div>
            <div className="group-name">
                {group.name}
            </div>
        </div>
    );
}
 
export default GroupSelectionBox;