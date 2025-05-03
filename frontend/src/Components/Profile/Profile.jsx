import "./Profile.css"
import notificationIcon from "../../Assets/icons/notifications.svg"
import settingsIcon from "../../Assets/icons/settings.svg"
import profileImage from "../../Assets/hero/hero_small.jpg"
import Link from "../../Router/Link"
import { useContext, useState } from "../../../react_lite/createDOM"
import { UserContext } from "../../Contexts/UserContext"
import { routerContext } from "../../Router/Router"

const Profile = () => {

    const notificationsCount = 3
    const {user} = useContext(UserContext)
    const [show, setShow] = useState(false)

    return ( 
        <div className="profile">
            <div className="notifications"><img src={notificationIcon} alt="" /><div className="notifications-count">{notificationsCount}</div></div>
            <div className="settings"><Link to="/user/settings/"><img src={settingsIcon} alt="" /></Link></div>
            <div className="profile-picture" onClick={()=>setShow(prev=>!prev)}><img src={user.uidImage} alt="" /></div>
            {show && (<ProfileContext setShow={setShow} />)}
        </div>
    );
}

const ProfileContext = ({setShow}) => {

    const {goto} = useContext(routerContext)

    const handler = (to) => {
        setShow(false)
        goto(to)
    }

    return (
        <div className="profile-contetx">
            <div className="item" onClick={()=>handler("/user/profile")}>Profile</div>
            <div className="item highlight" onClick={()=>handler("/user/premium")}>Go premium</div>
            <div className="item" onClick={()=>handler("/user/logout")}>Log out</div>
        </div>
    );
}

export default Profile;