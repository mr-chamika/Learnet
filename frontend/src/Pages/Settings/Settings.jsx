import { useState } from "../../../react_lite/createDOM";
import ChatSettings from "./Sections/Chat";
import GeneralSettings from "./Sections/General";
import PrivacySettings from "./Sections/Privacy";
import NotificationSettings from "./Sections/NotificationSettings";
import "./Settings.css"
import ContentSettings from "./Sections/ContentSettings";

const Settings = ({children}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    const onChangePasswordClick = (e) => {
        e.preventDefault()
        setPasswordChangeFieldVisible(true)
    }

    const onPasswordSave = (e) => {
        e.preventDefault()
        setPasswordChangeFieldVisible(false)
    }

    const [activeTab, setActiveTab] = useState("general")

    return ( 
        <div className="settings">
            <div className="topbar">
                <div className="left">
                    <button className={activeTab === "general" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("general")}>General</button>
                    <button className={activeTab === "notifications" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("notifications")}>Notifications</button>
                    <button className={activeTab === "privacy" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("privacy")}>Privacy</button>
                    <button className={activeTab === "chat" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("chat")}>Chat</button>
                    <button className={activeTab === "contents" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("contents")}>Contents</button>
                </div>
            </div>
            <GeneralSettings isActive={activeTab === "general"}/>
            <PrivacySettings isActive={activeTab === "privacy"}/>
            <ChatSettings isActive={activeTab === "chat"}/>
            <NotificationSettings isActive={activeTab === "notifications"}/>
            <ContentSettings isActive={activeTab === "contents"}/>
        </div>
     );
}
 
export default Settings;