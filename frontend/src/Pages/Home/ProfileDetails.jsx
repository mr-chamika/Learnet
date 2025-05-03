import coverImg from "../../Assets/hero/hero_small.jpg"
import profilePicture from "../../Assets/grp.jpg"

const ProfileDetails = () => {
    return ( 
        <div className="profile-details">
            <div className="cover-image"><img src={coverImg} /></div>
            <div className="profile-picture"><img src={profilePicture} /></div>
            <div className="username">Gishan</div>
            <div className="bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quos iusto excepturi sit voluptatibus eos quis accusantium officia aperiam, magnam, voluptas architecto quasi tempora. Ipsam hic sequi quos accusamus voluptate!</div>
            <div className="other-details">
                <div className="email">gishan@gmail.com</div>
                <div className="phone">+94768525351</div>
            </div>
        </div>
     );
}
 
export default ProfileDetails;