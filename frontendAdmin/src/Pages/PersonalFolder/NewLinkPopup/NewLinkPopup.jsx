import { useContext, useState } from "../../../../react_lite/createDOM"
import { FolderContext } from "../../../Contexts/FolderContext"
import { UserContext } from "../../../Contexts/UserContext"
import { formDataToObj } from "../../../Util/FormDataToObj"
import FolderTree from "../FolderTree/FolderTree"
import "./NewLinkPopup.css"

const NewLinkPopus = ({currentDir, setCurrentDir, setCurrentDirLinks}) => {

    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")
    const {user} = useContext(UserContext)
    const {folderHieracy: dirHierarcy} = useContext(FolderContext)


    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [link, setLink] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [license, setLicense] = useState(null)

    const [inCurrentDir, setInCurrentDir] = useState(true)

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        // const inputs = e.target.getElementsByTagName("input")
        const name = data.name
        const description = data.description
        const visibility = data.visibility
        const license = data.license

        fetch("http://localhost:8080/link/create", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                name,
                description,
                link,
                isPublic: visibility === "true" ? true : false,
                license,
                dirId: inCurrentDir ? currentDir._id : selectedFolder._id
            })
        })  
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data && data._id){
                // TODO : need set the entire hieracy, not just the current dir
                setCurrentDir((prev)=>{
                    return {...prev, links: [...prev.links, data._id]}
                })
            }else{
                setIsError(true)
                setError(data.error)
            }
        })
        .catch(err=>console.log("Error: ", err))
    }

    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleFolderSelect = (folder) => {
        setSelectedFolder(folder)
        console.log("Selected Folder:", folder);
      };
    
    // Toggle the expansion state of a folder
    const toggleFolderExpansion = (folderId) => {
        setExpandedFolders((prevState) => ({
            ...prevState,
            [folderId]: !prevState[folderId], // Toggle the state for this folder
        }));
    };

    const handleLicenseChange = (e) => {
        setLicense(e.target.value)
    }
    
    return ( 
        <div className="create-new-note-popup">
            <form onSubmit={submitHandler}>
                <label for="name">name</label><input type="text" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                <label for="description">description</label><input type="text" name="description" id="description" value={description} onChange={(e)=>setDescription(e.target.value)} />
                <label for="link">link</label><input type="text" name="link" id="link" value={link} onChange={(e)=>setLink(e.target.value)} />
                <label for="visibility">visibility</label><input type="checkbox" name="visibility" id="visibility" value="" checked={isPublic} onChange={(e)=>setIsPublic(prev=>!prev)} />
                <label for="GPL">GPL (GNU General Public License)</label><input type="radio" name="license" id="GPL" value="GPL" checked={license === "GPL" ? "true" : ""} onChange={handleLicenseChange}/>
                <label for="MIT">MIT License</label><input type="radio" name="license" id="MIT" value="MIT" checked={license === "MIT" ? "true" : ""} onChange={handleLicenseChange}/>
                <label for="CC">CC License</label><input type="radio" name="license" id="CC" value="CC" checked={license === "CC" ? "true" : ""} onChange={handleLicenseChange}/>
                <label for="Apache">Apache License</label><input type="radio" name="license" id="Apache" value="Apache" checked={license === "Apache" ? "true" : ""} onChange={handleLicenseChange}/>
                in current dir : <input type="checkbox" checked={inCurrentDir} onChange={(e)=>setInCurrentDir(prev=>!prev)} />
                {inCurrentDir && (
                    <div>Add the video to the current dir</div>
                )}
                {!inCurrentDir && 
                    (
                        <FolderTree
                        folder={dirHierarcy}
                        onSelect={handleFolderSelect}
                        expandedFolders={expandedFolders}
                        toggleFolderExpansion={toggleFolderExpansion}
                        />
                    )
                }
                <input type="submit" value="Create-note" />
            </form>
        </div>
     );
}
 
export default NewLinkPopus;