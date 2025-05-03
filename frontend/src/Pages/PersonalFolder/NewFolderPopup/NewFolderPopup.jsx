import { useContext, useState } from "../../../../react_lite/createDOM"
import { FolderContext } from "../../../Contexts/FolderContext"
import { UserContext } from "../../../Contexts/UserContext"
import { formDataToObj } from "../../../Util/FormDataToObj"

const NewFolderPopup = ({currentDir, setCurrentDir}) => {

    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")
    const {user} = useContext(UserContext)
    const {setFolderHieracy} = useContext(FolderContext)

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
            if(!data.error){
                setFolderHieracy(data.hieracy)
            }
            // setCurrentDir(prev => {
            //     // prev.subDirs.push({name, createdOn: "2024-05-10 21:10", subDirs: []})
            //     const date = new Date()
            //     prev.subDirs.push({name, createdOn: date.toLocaleString().replace(",", " "), subDirs: []})
            //     return {...prev}
            // })
        })
        .catch(err=>console.log(err))
    }

    return ( 
        <div className="create-new-note-popup">
            <div className="section">
                <div className="heading">
                    New Folder
                </div>
                <form onSubmit={newFolderHandler}>
                    <div className="items-container">
                        <dl className="item">
                            <dt className="title">
                                <label for="">Name</label>
                            </dt>
                            <dd className="input">
                                <input type="text" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                                <div className="message">Provide a proper name to make it easy to find. Make it brief</div>
                            </dd>
                        </dl>
                        <div className="form-bottom-buttons">
                            <button className="icon-button">Create Folder</button>
                            <button className="icon-button">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default NewFolderPopup;