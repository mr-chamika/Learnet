import {  createContext, useContext, useEffect, useState } from "../../../frontend/react_lite/createDOM";
import { UserContext } from "./UserContext";

export const otherUsersContext = createContext({})

const OtherUsersContextProvider = ({children}) => {

    const {user, setUser} = useContext(UserContext)
    const [currentUserPage, setCurrentUserPage] = useState(0)
    const [users, setUsers] = useState({})

    const fetchUsersIfNotExist = async (userIds) => {
        const userIdsToFetch = userIds.filter((userId)=>{
            if(users[userId]) return false
            return true
        })

        fetch("http://localhost:8080/user/auth/get", {
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
            }else{
                console.log(data.error)
            }
        })
        .catch(err=>console.log(err))
    }
    
    const fetchNext = () => {
        setUser(user=>{
            setCurrentUserPage(page=>{
                fetch("http://localhost:8080/user/admin/get", {
                    method: "POST",
                    headers: {
                        authorization: `bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        page
                    })
                })
                .then(res=>res.json())
                .then(data=>{
                    // console.log("data : ", data)
                    if(!data.error){
                        const usersData = {}
                        const uids = data.map(userDetails=>userDetails._id)
                        for(let i = 0; i < uids.length; i++){
                            usersData[uids[i]] = data[i]
                        }
            
                        setUsers(prev=>{
                            // console.log("{...prev, ...usersData}: ", prev, usersData)
                            return {...prev, ...usersData}
                        })
                        setCurrentUserPage(prev=>prev+1)
                    }else{
                        console.log(data.error)
                    }
                })
                .catch(err=>console.log(err))
    
                return page
            })

            return user
        })
    }

    const updateUser = (updatedUserData) => {
        setUsers(prev=>{
            prev[updatedUserData._id] = {...prev[updatedUserData._id], ...updatedUserData}
            return {...prev}
        })
    }

    useEffect(()=>{
        if(user && user.token){
            fetchNext()
        }
    }, [user])

    // console.log("users: ", users)

    return ( 
        <otherUsersContext.Provider value={{users, setUsers, fetchUsersIfNotExist, fetchNext, updateUser}}>
            {children}
        </otherUsersContext.Provider>
     );
}
 
export default OtherUsersContextProvider;