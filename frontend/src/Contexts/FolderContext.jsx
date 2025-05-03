import { createContext, setContext, useContext, useEffect, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

export const FolderContext = createContext({})

const FolderContextProvider = ({children}) => {

    const [folderHieracy, setFolderHieracy] = useState({
        name: "/",
        createdOn: "",
        notes: [],
        videos: [],
        links: [],
        files: [],
        subDirs: []
    })
    const {user} = useContext(UserContext)

    useEffect(()=>{
        fetch("http://localhost:8080/dir/all", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            }
        })        
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setFolderHieracy(data)
            }
            // console.log("data : ", data)
        })
        .catch(err=>console.log(err))
    }, [user])

    // useEffect(()=>{
    //     console.log(user)
    // }, [user])

    // setContext(FolderContext, {folderHieracy, setFolderHieracy})

    return ( 
        <FolderContext.Provider value={{folderHieracy, setFolderHieracy}}>
            {children}
        </FolderContext.Provider>
     );
}
 
export default FolderContextProvider;