import { useContext, useState } from "../../../../react_lite/createDOM"
import { UserContext } from "../../../Contexts/UserContext"
import { formDataToObj } from "../../../Util/FormDataToObj"

const NewFolderPopup = ({currentDir, setCurrentDir}) => {

    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")
    const {user} = useContext(UserContext)

    const [name, setName] = useState("")
    
    const newFolderHandler = (e) => {
        e.preventDefault()
        // const name = prompt("Enter the new folder name")
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        fetch("http://localhost:8080/dir/", {
            method: "PATCH",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                action: "create-directory",
                directoryId: currentDir._id, 
                name: data.name
            })
        })        
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)
            // setFolderHieracy(data)
            setCurrentDir(prev => {
                // prev.subDirs.push({name, createdOn: "2024-05-10 21:10", subDirs: []})
                const date = new Date()
                prev.subDirs.push({name, createdOn: date.toLocaleString().replace(",", " "), subDirs: []})
                return {...prev}
            })
        })
        .catch(err=>console.log(err))
    }

    return ( 
        <div className="create-new-note-popup">
            <form onSubmit={newFolderHandler}>
                <label for="name">name</label><input type="text" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="submit" value="Create-note" />
            </form>
        </div>
     );
}
 
export default NewFolderPopup;