import { useState } from "../../../../react_lite/createDOM";
import { openPopup } from "../../../Components/PopupBox/PopupBox";
import "./Topbar.css"

const Topbar = () => {

    const [activeLeft, setActiveLeft] = useState("all")

    const newChatPopupHandler = () => {
        openPopup(document.querySelector(".chat .popup-box.new-chat"))
    }

    const newGroupPopupHandler = () => {
        openPopup(document.querySelector(".chat .popup-box.new-group"))
    }

    const newCommunityPopupHandler = () => {
        openPopup(document.querySelector(".chat .popup-box.new-community"))
    }

    return ( 
        <div className="chat-topbar">
            <div className="left">
                <button className={activeLeft === "all" ? "tab-button active" : "tab-button"} onClick={()=>setActiveLeft("all")}>All</button>
                <button className={activeLeft === "unread" ? "tab-button active" : "tab-button"} onClick={()=>setActiveLeft("unread")}>Unread</button>
                <button className={activeLeft === "favourits" ? "tab-button active" : "tab-button"} onClick={()=>setActiveLeft("favourits")}>Favourits</button>
                <button className={activeLeft === "groups" ? "tab-button active" : "tab-button"} onClick={()=>setActiveLeft("groups")}>Groups</button>
            </div>
            <div className="right">
                <button className="icon-button" onClick={newChatPopupHandler}>New Chat</button>
                <button className="icon-button" onClick={newGroupPopupHandler}>New Group</button>
                <button className="icon-button" onClick={newCommunityPopupHandler}>New Community</button>
            </div>
        </div>
     );
}
 
export default Topbar;