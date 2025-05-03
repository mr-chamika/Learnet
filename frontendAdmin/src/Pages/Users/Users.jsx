import { useContext, useEffect, useState } from "../../../../frontend/react_lite/createDOM";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { UserContext } from "../../Contexts/UserContext";
import UserCard from "./UserCard";
import "./Users.css"

const Users = () => {

    // const userDetails = [
    //     { id: 1, name: "John Doe", email: "1001@stu.ucsc.cmb.ac.lk", type: "Standard User" },
    //     { id: 2, name: "Jane Smith", email: "1002@stu.ucsc.cmb.ac.lk", type: "Premium User" },
    //     { id: 3, name: "Michael Brown", email: "1003@stu.ucsc.cmb.ac.lk", type: "Admin" },
    //     { id: 4, name: "Emily Davis", email: "1004@stu.ucsc.cmb.ac.lk", type: "Moderator" },
    //     { id: 5, name: "Chris Wilson", email: "1005@stu.ucsc.cmb.ac.lk", type: "Standard User" },
    // ];

    const {user, setUser} = useContext(UserContext)
    const {users, fetchNext} = useContext(otherUsersContext)
    const [curScrollHeight, setCurScrollHeight] = useState(0)
    const [searchValue, setSearchValue] = useState("")

    const [userDetails, setUserDetails] = useState(Object.values(users))
    useEffect(()=>{
        setUserDetails(Object.values(users))
    }, [users])

    const loadMoreHandler = () => {
        // setCurScrollHeight(document.querySelector(".user .users-details").scrollHeight)
        fetchNext()
    }

    const searchHandler = (e) => {
        console.log("user: in search ", user)
        e.preventDefault()

        const formData = new FormData(e.target)

        setUser(user=>{
            console.log("search token : ", user)
            fetch("http://localhost:8080/user/admin/search",{
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: formData
            })
            .then(res=>res.json())
            .then(data=>{
                if(!data.error){
                    console.log("search results : ", data)
                    if(data instanceof Array){
                        setUserDetails(data)
                    }
                }
            })
            .catch(err=>console.log(err))
            return user
        })
    }

    console.log("users to render: ", user)

    const onChange = (e) => {
        if(e.target.value.trim() === ""){
            setUserDetails(Object.values(users))
        }
        setSearchValue(e.target.value)
        document.querySelector('input[name="search"]').focus()
    }
    
    return (
        <div className="users">
            <div className="users-topbar">
                <form onSubmit={searchHandler}>
                    <div className="input-fields">
                        <input type="text" name="search" value={searchValue} placeholder="Search by name, email, university ID" onInput={onChange}/>
                        <input type="submit" name="submit" value="Search" />
                    </div>
                </form>
            </div>
            <div className="users-details">
                <div className="header">
                    <div className="header-item">Name</div>
                    <div className="header-item">Email</div>
                    <div className="header-item">Type</div>
                    <div className="header-item">View</div>
                    <div className="header-item">Edit</div>
                    <div className="header-item">Suspend / Reactivate</div>
                </div>
               {userDetails && userDetails.map(user => {
                    return (
                        <UserCard key={user._id} userData={user} />
                    )
                })}
            </div>
            {!searchValue && (
                <div className="load-more-container">
                    <button className="icon-button load-more" onClick={loadMoreHandler}>Load more</button>
                </div>
            )}
        </div>
     );
}
 
export default Users;