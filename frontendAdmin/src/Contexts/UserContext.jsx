import { createContext, setContext, useEffect, useState } from "../../../frontend/react_lite/createDOM";

export const UserContext = createContext({})

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState({})

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            const email = localStorage.getItem("email")
            const name = localStorage.getItem("name")
            const userId = localStorage.getItem("userId")
            console.log("setting user")
            setUser({name, email, token, userId})
    
            // fetch("http://localhost:8080/user/auth/get-profile-picture",{
            //     method: "POST",
            //     headers: {
            //         authorization: `bearer ${token}`
            //     },
            //     body: JSON.stringify({
            //         userId
            //     })
            // })
            // .then((res)=>res.blob())
            // .then((blob)=>{
            //     // console.log("blob : ", blob)
            //     const url = URL.createObjectURL(blob);
            //     setUser(prev=>{return {...prev, uidImage: url}})            
            // })
            // console.log("user set")
        }
    }, [])

    return ( 
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
     );
}
 
export default UserContextProvider;