import ChatBox from "../../../Components/ChatBox/ChatBox";
import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/icons/search.svg"
import { useContext, useState } from "../../../../react_lite/createDOM";
import uploadAreaIcon from "../../../Assets/icons/upload_area.svg"

import "./NewGroupForm.css"
import TagInputField from "../../../Components/TagInputField/TagInputField";
import { formDataToObj } from "../../../Util/FormDataToObj";
import updateFormData from "../../../Util/updateFormData";
import { UserContext } from "../../../Contexts/UserContext";
import FriendSelectionBox from "../../../Components/FriendSelectionBox/FriendSelectionBox";

const NewGroupForm = ({socket}) => {

    const [image, setImage] = useState(false)
    const {user} = useContext(UserContext)
    const [formDataState, setFormDataState] = useState({
        name: "",
        description: "",
        visibility: "PRIVATE",
        members: "",
        admins: "",
        addMembers: "admins-only",
        removeMembers: "admins-only",
        addAdmins: "owner-only",
        removeAdmins: "owner-only",
        editGroupInfo: "members-only",
        sendMessages: "members-only",
        groupImage: ""
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const selectedMemberCount = 0
    const maxMemberCount = 100

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const name = data.name
        const description = data.description
        const visibility = data.visibility
        const members = JSON.parse(data.members)
        console.log("members : ", members)
        const admins = JSON.parse(data.admins)
        const addMembers = data.addMembers
        const removeMembers = data.removeMembers
        const addAdmins = data.addAdmins
        const removeAdmins = data.removeAdmins
        const editGroupInfo = data.editGroupInfo
        const sendMessages = data.sendMessages

        fetch("http://localhost:8080/chatimage/create",{
            method: "POST",
            headers: {
                // "content-type": "multipart/form-data",
                authorization: `bearer ${user.token}`
            },
            body: formData
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                socket.send(JSON.stringify({
                    type: "create-group",
                    data: {
                        name,
                        description,
                        visibility,
                        members: members || [],
                        admins: admins || [],
                        permissions:{
                            addMembers,
                            removeMembers,
                            addAdmins,
                            removeAdmins,
                            editGroupInfo,
                            sendMessages
                        },
                        groupImage: data.fileId
                    }
                }))
            }
        })

    }

    const onChange = (e) =>{
        updateFormData(e, setFormDataState)
    }

    // console.log("form data state : ", formDataState)

    return ( 
        <div className="create-new-group-popup">
            <div className="section">
                <div className="heading">
                    Create a New Group
                </div>
                <form onSubmit={submitHandler} onChange={onChange}>
                    <Slider onSubmit={()=>{}}>
                        <div className="items-container">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Name</label>
                                </dt>
                                <dd className="input">
                                    <div className="itemfield">
                                        <label htmlFor="file-input">
                                            <img src={image ? URL.createObjectURL(image) : uploadAreaIcon} className='itemfield-image' alt="" />
                                        </label>
                                        <input onChange={(e)=>imageHandler(e)} name="groupImage" type="file" files={formDataState.groupImage} id='file-input' accept="image/jpg,image/png,image/jpeg" title="profile picture"/>
                                    </div>
                                    <input type="text" name="name" value={formDataState.name} />
                                    <div className="message">Provide a proper name to make it easy to find. Make it brief</div>
                                </dd>
                            </dl>
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
                                    <label for="">Group visibility</label>
                                </dt>
                                <dd className="input">
                                    <select name="visibility" value={formDataState.visibility}>
                                        <option value="PRIVATE" selected={formDataState.visibility === "PRIVATE" ? true : false}>PRIVATE</option>
                                        <option value="FRIENDS ONLY" selected={formDataState.visibility === "FRIENDS ONLY" ? true : false}>FRIENDS ONLY</option>
                                        <option value="PUBLIC" selected={formDataState.visibility === "PUBLIC" ? true : false}>PUBLIC</option>
                                    </select>
                                    <div className="message">Public groups will be suggested to other users through the feed.</div>
                                </dd>
                            </dl>
                        </div>
                        <div className="items-container member-selection">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Members</label>
                                </dt>
                                <dd className="input">
                                    <div className="message">Specify the users you want to be members of the group, either using there user name or university email.</div>
                                    {/* <TagInputField name="members" value={formDataState.members} key="1"/> */}
                                    <FriendSelectionBox max={2} allowMultiple={true} inputName="members" values={formDataState.members} key="1" />
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Admins</label>
                                </dt>
                                <dd className="input">
                                    <div className="message">Specify the users you want to have adminstrative permissions in the group, either using there user name or university email.
                                        Users you specify here will be added as members of the group
                                    </div>
                                    {/* <TagInputField name="admins" value={formDataState.admins} key="2"/> */}
                                    <FriendSelectionBox allowMultiple={true} inputName="admins" values={formDataState.admins} key="2" />
                                </dd>
                            </dl>
                        </div>
                        <div className="items-container">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Adding members</label>
                                </dt>
                                <dd className="input">
                                    <select name="addMembers" value={formDataState.addMembers}>
                                        <option value="owner-only" selected={formDataState.addMembers === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.addMembers === "admins-only" ? true : false}>Admins only</option>
                                        <option value="members-only" selected={formDataState.addMembers === "members-only" ? true : false}>Members only</option>
                                    </select>
                                    <div className="message">Specify who can add members to the group. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Removing members</label>
                                </dt>
                                <dd className="input">
                                    <select name="removeMembers" value={formDataState.removeMembers}>
                                        <option value="owner-only" selected={formDataState.removeMembers === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.removeMembers === "admins-only" ? true : false}>Admins only</option>
                                    </select>
                                    <div className="message">Specify who can remove members from the group. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Adding admins</label>
                                </dt>
                                <dd className="input">
                                    <select name="addAdmins" value={formDataState.addAdmins}>
                                        <option value="owner-only" selected={formDataState.addAdmins === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.addAdmins === "admins-only" ? true : false}>Admins only</option>
                                    </select>
                                    <div className="message">Specify who can add admins to the group. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Removing admins</label>
                                </dt>
                                <dd className="input">
                                    <select name="removeAdmins" value={formDataState.removeAdmins}>
                                        <option value="owner-only" selected={formDataState.removeAdmins === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.removeAdmins === "admins-only" ? true : false}>Admins only</option>
                                    </select>
                                    <div className="message">Specify who can remove admins from the group. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Edit group details</label>
                                </dt>
                                <dd className="input">
                                    <select name="editGroupInfo" value={formDataState.editGroupInfo}>
                                        <option value="owner-only" selected={formDataState.editGroupInfo === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.editGroupInfo === "admins-only" ? true : false}>Admins only</option>
                                        <option value="members-only" selected={formDataState.editGroupInfo === "members-only" ? true : false}>Members only</option>
                                    </select>
                                    <div className="message">Specify who can change the group details like the group name, group description. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Send messages</label>
                                </dt>
                                <dd className="input">
                                    <select name="sendMessages" value={formDataState.sendMessages}>
                                        <option value="owner-only" selected={formDataState.sendMessages === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.sendMessages === "admins-only" ? true : false}>Admins only</option>
                                        <option value="members-only" selected={formDataState.sendMessages === "members-only" ? true : false}>Members only</option>
                                    </select>
                                    <div className="message">Secify who can send messages in the group. Default value is 'members'</div>
                                </dd>
                            </dl>
                        </div>
                    </Slider>
                </form>
            </div>
        </div>
    );
}
 
export default NewGroupForm;