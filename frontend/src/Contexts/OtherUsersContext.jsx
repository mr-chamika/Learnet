import { createContext, useContext, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

export const otherUsersContext = createContext({})

const OtherUsersContextProvider = ({children}) => {

    const {user} = useContext(UserContext)
    const [users, setUsers] = useState({})

    const fetchUsersIfNotExist = async (userIds) => {
        if(userIds && userIds instanceof Array){
            const userIdsToFetch = userIds.filter((userId)=>{
                if(users[userId]) return false
                return true
            })
    
            fetch("http://localhost:8080/user/get", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({userIds: userIdsToFetch})
            })
            .then(res=>res.json())
            .then(data=>{
                if(!data.error){
                    const usersData = {}
                    const uids = data.map(userDetails=>userDetails._id)
                    for(let i = 0; i < uids.length; i++){
                        usersData[uids[i]] = data[i]
                    }
    
                    setUsers(prev=>{
                        return {...prev, ...usersData}
                    })
    
                    userIdsToFetch.forEach(uid=>{
                        fetch("http://localhost:8080/user/auth/get-profile-picture",{
                            method: "POST",
                            headers: {
                                authorization: `bearer ${user.token}`
                            },
                            body: JSON.stringify({
                                userId: uid
                            })
                        })
                        .then((res)=>res.blob())
                        .then((blob)=>{
                            const url = URL.createObjectURL(blob);
                            console.log("profile image fetched : ", uid, url)
                            setUsers(prev=>{return {...prev, [uid] : {...prev[uid], profilePicture: url}}})            
                        })
                    })
                }else{
                    console.log(data.error)
                }
            })
            .catch(err=>console.log(err))
        }
    }

    console.log("users : ", users)

    return ( 
        <otherUsersContext.Provider value={{users, setUsers, fetchUsersIfNotExist}}>
            {children}
        </otherUsersContext.Provider>
     );
}
 
export default OtherUsersContextProvider;