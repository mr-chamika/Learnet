import "./Profile.css"
import notificationIcon from "../../Assets/icons/notifications.svg"
import settingsIcon from "../../Assets/icons/settings.svg"
import profileImage from "../../Assets/hero/hero_small.jpg"

const Profile = () => {

    const notificationsCount = 3

    return ( 
        <div className="profile">
            <div className="notifications"><img src={notificationIcon} alt="" /><div className="notifications-count">{notificationsCount}</div></div>
            <div className="settings"><img src={settingsIcon} alt="" /></div>
            <div className="profile-picture"><img src={profileImage} alt="" /></div>
        </div>
     );
}
 
export default Profile;