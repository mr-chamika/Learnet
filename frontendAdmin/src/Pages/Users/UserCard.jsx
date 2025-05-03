import { useContext } from "../../../../frontend/react_lite/createDOM";
import Link from "../../../../frontend/src/Router/Link";
import { routerContext } from "../../../../frontend/src/Router/Router";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { UserContext } from "../../Contexts/UserContext";
import "./UserCard.css"

const UserCard = ({ userData }) => {

    const {goto} = useContext(routerContext)
    const {user, setUser} = useContext(UserContext)
    const {updateUser} = useContext(otherUsersContext)
    
    const handleEdit = () => {
        // alert(`Editing userData: ${userData.name}`);
        goto("/admin/users/userData/1/edit")
    };
  
    const handleSuspend = (action) => {
        console.log("user ID : ", userData)
        setUser(user=>{
            fetch(`http://localhost:8080/user/admin/${action}`,{
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({
                    userId: userData._id
                })
            })
            .then(res=>res.json())
            .then(res=>{
                console.log("res : ", res)
                if(!res.error){
                    updateUser({_id: userData._id, isSuspended: action === "suspend" ? true : false})
                }
            })
            .catch(err=>console.log(err))

            return user
        })
    };
  
    return (
        <div className="user-card">
            <div>{userData.name}</div>
            <div>{userData.email}</div>
            {userData.isModerator ? 
            (
                <div>Moderator</div>
            ) : (
                <div>Regular</div>
            )}
            <div>
                <Link className="edit-btn" label="View" to={`/admin/users/userData/${userData.id}`}/>
            </div>
            <div>
                <button onClick={handleEdit} className="edit-btn">Edit</button>
            </div>
            <div>
                {userData.isSuspended ? (<button onClick={()=>handleSuspend("activate")} className="suspend-btn">Reactivate</button>)
                : (<button onClick={()=>handleSuspend("suspend")} className="suspend-btn">Suspend</button>)}
            </div>
        </div>
    );
};

export default UserCard;