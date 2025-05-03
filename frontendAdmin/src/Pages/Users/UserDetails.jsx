import "./UserDetails.css"
import userImg from "../../Assets/admin/user.jpg"
import userIdImg from "../../Assets/admin/userId.jpg"
import { useContext } from "../../../../frontend/react_lite/createDOM"
import { routerContext } from "../../../../frontend/src/Router/Router"

const UserDetails = () => {

    const {goto} = useContext(routerContext)

    const editHandler = () => {
        goto("/admin/users/user/1/edit")
    }

    return ( 
        <div class="user-profile">
            <div className="button-panel">
                <button className="edit-button" onClick={editHandler}>Edit User</button>
                <button className="suspend-button">Suspend User</button>
            </div>
            <div class="user-details">
                <h2>User Information</h2>
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> 1001@stu.ucsc.cmb.ac.lk</p>
                <p><strong>Email Verified:</strong> Yes</p>
                <p><strong>Type:</strong> Standard user</p>
                <p><strong>University ID Number:</strong> UCSC20231001</p>
                <p><strong>University:</strong> University of Colombo School of Computing</p>
            </div>
            <div class="user-images">
                <h3>Images</h3>
                <p><strong>Profile Image:</strong></p>
                <img src={userImg} alt="Profile Image" class="profile-image" />
                <p><strong>University ID Image:</strong></p>
                <img src={userIdImg} alt="University ID Image" class="university-id-image" />
            </div>
            <div class="user-tags">
                <h3>Interested Tags</h3>
                <ul>
                    <li>Artificial Intelligence</li>
                    <li>Web Development</li>
                    <li>Machine Learning</li>
                    <li>Software Engineering</li>
                </ul>
            </div>
        </div>

     );
}
 
export default UserDetails;