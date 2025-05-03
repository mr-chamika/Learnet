import { useContext, useState } from "../../../../react_lite/createDOM"
import { FolderContext } from "../../../Contexts/FolderContext"
import { UserContext } from "../../../Contexts/UserContext"
import { formDataToObj } from "../../../Util/FormDataToObj"
import { focusNext } from "../../../Util/FormFocusNext"
import updateFormData from "../../../Util/updateFormData"
import FolderTree from "../FolderTree/FolderTree"
import Slider from "../../../Components/Slider/Slider"
// import "./NewNotePopup.css"\w
import TagInputField from "../../../Components/TagInputField/TagInputField"
import FolderTreeContainer from "../FolderTree/FolderTreeContainer"

const UploadFilePopup = ({currentDir, setCurrentDir}) => {

    // const {name, description, content, visibility, license, sharedWith, dirId} = req.body
    const [formDataState, setFormDataState] = useState({
        name: "",
        description: "",
        content: "",
        visibility: "private",
        license: "",
        file: "",
        sharedWith: "",
    })

    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")
    const {user} = useContext(UserContext)
    const {folderHieracy: dirHierarcy, setFolderHieracy} = useContext(FolderContext)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [license, setLicense] = useState(null)

    const [inCurrentDir, setInCurrentDir] = useState(true)

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append("dirId", inCurrentDir ? currentDir._id : selectedFolder._id)
        // const data = formDataToObj(formData)
        // const inputs = e.target.getElementsByTagName("input")
        // const name = data.name
        // const description = data.description
        // const visibility = data.visibility
        // const license = data.license

        console.log("formDataToObj(formData): ", formDataToObj(formData))

        fetch("http://localhost:8080/file/create", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`,
                // "Content-Type": "multipart/form-data; boundary=--lk2A3@kl$le2",
            },
            // body: JSON.stringify({
            //     name,
            //     description,
            //     content: "",
            //     visibility,
            //     license,
            //     dirId: inCurrentDir ? currentDir._id : selectedFolder._id
            // })
            body: formData
        })  
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data && !data.error){
                // setCurrentDir(prev=>{
                //     return {...prev, files: [...prev.files, data._id]}
                // })
                console.log("dir hieracy : ", data.hieracy)
                setFolderHieracy(data.hieracy)
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

    const onChange = (e) =>{
        updateFormData(e, setFormDataState)
    }

    const onCancel = () => {

    }

    return (
        <div className="create-new-note-popup">
            <div className="section">
                <div className="heading">
                    Upload File
                </div>
                <form onSubmit={submitHandler} onChange={onChange}>
                    <Slider onCancel={onCancel} onSubmit={()=>{}}>
                        <div className="items-container">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Name</label>
                                </dt>
                                <dd className="input">
                                    <input type="text" name="name" value={formDataState.name} />
                                    <div className="message">Provide a proper name to make it easy to find. Make it brief</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Author</label>
                                </dt>
                                <dd className="input">
                                    <select name="author" value={formDataState.author}>
                                        <option value="ME" selected={formDataState.author === "Me" ? true : false}>Me</option>
                                        <option value="OTHER" selected={formDataState.author === "Other" ? true : false}>Other</option>
                                    </select>
                                    <div className="message">Select the author of the content. Choose 'Me' if you are the author, 'Other' for someone else.</div>
                                </dd>
                            </dl>
                            { formDataState.author === "Other" && 
                                (
                                    <dl className="item">
                                        <dt className="title">

                                        </dt>
                                        <dd className="input">
                                            <input type="text" name="authorName" value={formDataState.authorName} />
                                            <div className="message">Enter the name of the author.</div>
                                        </dd>
                                    </dl>
                                )
                            }
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Description</label>
                                </dt>
                                <dd className="input">
                                    <textarea name="description" value={formDataState.description}></textarea>
                                    <div className="message">Provide a comprehensive description on the note content. This field is important for public notes.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Lisence</label>
                                </dt>
                                <dd className="input">
                                    <select name="license" value={formDataState.license}>
                                        <option value="GPL" selected={formDataState.license === "GPL" ? true : false}>GPL</option>
                                        <option value="MIT" selected={formDataState.license === "MIT" ? true : false}>MIT</option>
                                        <option value="CC" selected={formDataState.license === "CC" ? true : false}>CC</option>
                                        <option value="APACHE" selected={formDataState.license === "APACHE" ? true : false}>APACHE</option>
                                    </select>
                                    <div className="message">This filed specifies the permissions you or other viewers have with this note, and necessary if you are making the note either public or shared. More information on license here</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Agreement</label>
                                </dt>
                                <dd className="form-checkbox">
                                    <input name="agreement" type="checkbox" checked={formDataState.agreement}/>
                                    {/* <label for="">I have read and agreed to the terms and conditions</label> */}
                                    <div className="message">I give my concent for Learnet to share this note with the way I specified. I know I'm responsible for all the copywrite issues with it.</div>
                                </dd>
                            </dl>
                        </div>
                        <div className="items-container">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">File</label>
                                </dt>
                                <dd className="input">
                                    <input name="file" type="file" files={formDataState.file} accept="video/mp4,image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,image/gif,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-rar-compressed"/>
                                    <div className="message">
                                        <span>Attach the file you want to upload. </span><br />
                                        <span>Supoorted file types : mp4, jpg, jpeg, png, pdf, docx, xlsx, txt, csv, gif, pptx, zip, rar</span>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Save path</label>
                                </dt>
                                <dd className="form-checkbox">
                                    <input name="current_dir" type="checkbox" checked={inCurrentDir} onChange={(e)=>setInCurrentDir(prev=>!prev)}/>
                                    {/* <label for="">I have read and agreed to the terms and conditions</label> */}
                                    <div className="message">Tick to save the file to the current path or specify the path.</div>
                                </dd>
                            </dl>
                            {/* in current dir : <input type="checkbox" checked={inCurrentDir} onChange={(e)=>setInCurrentDir(prev=>!prev)} /> */}
                            {inCurrentDir && (
                                <div className="message">Note will be saved to the current directory</div>
                            )}
                            <FolderTreeContainer
                                isActive={!inCurrentDir}
                                folder={dirHierarcy}
                                onSelect={handleFolderSelect}
                                expandedFolders={expandedFolders}
                                toggleFolderExpansion={toggleFolderExpansion}
                            />
                        </div>
                        <div className="items-container">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Visibility</label>
                                </dt>
                                <dd className="input">
                                    <select name="visibility">
                                        <option value="PRIVATE" selected={formDataState.visibility === "PRIVATE" ? true : false}>PRIVATE</option>
                                        <option value="SHARED" selected={formDataState.visibility === "SHARED" ? true : false}>SHARED</option>
                                        <option value="PUBLIC" selected={formDataState.visibility === "PUBLIC" ? true : false}>PUBLIC</option>
                                        <option value="FRIENDS ONLY" selected={formDataState.visibility === "FRIENDS ONLY" ? true : false}>FRIENDS ONLY</option>
                                    </select>
                                    <div className="message">Select who have permission to view the note. Only you will be able to modify it.</div>
                                </dd>
                            </dl>
                            { formDataState.visibility === "SHARED" && 
                                (
                                    <dl className="item">
                                        <dt className="title">
                                            <label for="">Shared with</label>
                                        </dt>
                                        <dd className="input">
                                            <div className="message">Specify the users you want to share this file with, either using there user name or university email.</div>
                                            <TagInputField name="sharedWith" value={formDataState.sharedWith}/>
                                            {/* <label for="">I have read and agreed to the terms and conditions</label> */}
                                        </dd>
                                    </dl>
                                )
                            }
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Tags</label>
                                </dt>
                                <dd className="input">
                                    <div className="message">Add relevant tags to categorize and improve discoverability. Separate multiple tags with commas.</div>
                                    <TagInputField name="tags" value={formDataState.tags}/>
                                    {/* <label for="">I have read and agreed to the terms and conditions</label> */}
                                </dd>
                            </dl>
                        </div>
                    </Slider>
                    {/* <div className="form-bottom-buttons">
                        <button className="icon-button">Create Note</button>
                        <button className="icon-button">Cancel</button>
                    </div> */}
                </form>
            </div>
        </div>
    );
}
 
export default UploadFilePopup;