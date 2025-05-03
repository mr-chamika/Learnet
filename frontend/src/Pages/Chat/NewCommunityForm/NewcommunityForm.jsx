import ChatBox from "../../../Components/ChatBox/ChatBox";
import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/icons/search.svg"
import { useContext, useState } from "../../../../react_lite/createDOM";
import uploadAreaIcon from "../../../Assets/icons/upload_area.svg"

// import "./NewCommunityForm.css"
import TagInputField from "../../../Components/TagInputField/TagInputField";
import { formDataToObj } from "../../../Util/FormDataToObj";
import updateFormData from "../../../Util/updateFormData";
import GroupDetails from "../../../../../chatServer/models/GroupChat/GroupDetails";
import FriendSelectionBox from "../../../Components/FriendSelectionBox/FriendSelectionBox";
import GroupSelectionBox from "../../../Components/GroupSelectionBox/GroupSelectionBox";
import { UserContext } from "../../../Contexts/UserContext";

const NewCommunityForm = ({groups, socket}) => {

    const {user} = useContext(UserContext)
    const [image, setImage] = useState(false)
    const [formDataState, setFormDataState] = useState({
        name: "",
        description: "",
        visibility: "PRIVATE",
        groups: "",
        admins: "",
        addMembers: "admins-only",
        removeMembers: "admins-only",
        addAdmins: "owner-only",
        removeAdmins: "owner-only",
        editCommunityInfo: "members-only",
        sendMessages: "members-only"
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
        const groups = data.groups
        console.log("groups : ", groups)
        const admins = data.admins
        const addMembers = data.addMembers
        const removeMembers = data.removeMembers
        const addAdmins = data.addAdmins
        const removeAdmins = data.removeAdmins
        const editCommunityInfo = data.editCommunityInfo
        const sendMessages = data.sendMessages

        fetch("http://localhost:8080/chatimage/create",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: formData
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                socket.send(JSON.stringify({
                    type: "create-community",
                    data: {
                        name,
                        description,
                        visibility,
                        groups: JSON.parse(groups),
                        admins: JSON.parse(admins),
                        permissions:{
                            addMembers,
                            removeMembers,
                            addAdmins,
                            removeAdmins,
                            editCommunityInfo,
                            sendMessages
                        },
                        communityImage: data.fileId
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
        <div className="create-new-community-popup">
            <div className="section">
                <div className="heading">
                    Create a New Community
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
                                        <input onChange={(e)=>imageHandler(e)} type="file" name='communityImage' files={formDataState.communityImage} id='file-input' accept="image/jpg,image/png,image/jpeg" title="profile picture"/>
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
                                    <label for="">Community visibility</label>
                                </dt>
                                <dd className="input">
                                    <select name="visibility" value={formDataState.visibility}>
                                        <option value="PRIVATE" selected={formDataState.visibility === "PRIVATE" ? true : false}>PRIVATE</option>
                                        <option value="FRIENDS ONLY" selected={formDataState.visibility === "FRIENDS ONLY" ? true : false}>FRIENDS ONLY</option>
                                        <option value="PUBLIC" selected={formDataState.visibility === "PUBLIC" ? true : false}>PUBLIC</option>
                                    </select>
                                    <div className="message">Public communitys will be suggested to other users through the feed.</div>
                                </dd>
                            </dl>
                        </div>
                        <div className="items-container group-admin-selection">
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Groups</label>
                                </dt>
                                <dd className="input">
                                    <div className="message">Specify the groups you want to be in the community, using the group name.
                                    </div>
                                    <GroupSelectionBox groups={groups} allowMultiple={true} max={20} inputName="groups" key="2" />
                                    {/* <TagInputField name="groups" value={formDataState.groups} key="2"/> */}
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Admins</label>
                                </dt>
                                <dd className="input">
                                    <div className="message">Specify the users you want to have adminstrative permissions in the community, either using there user name or university email.
                                        Users you specify here will be added as members of the community
                                    </div>
                                    <FriendSelectionBox allowMultiple={true} inputName="admins" values={formDataState.admins} key="3" />
                                    {/* <TagInputField name="admins" value={formDataState.admins} key="3"/> */}
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
                                    <div className="message">Specify who can add members to the community. Default value is 'owner only'.</div>
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
                                    <div className="message">Specify who can remove members from the community. Default value is 'owner only'.</div>
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
                                    <div className="message">Specify who can add admins to the community. Default value is 'owner only'.</div>
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
                                    <div className="message">Specify who can remove admins from the community. Default value is 'owner only'.</div>
                                </dd>
                            </dl>
                            <dl className="item">
                                <dt className="title">
                                    <label for="">Edit community details</label>
                                </dt>
                                <dd className="input">
                                    <select name="editCommunityInfo" value={formDataState.editCommunityInfo}>
                                        <option value="owner-only" selected={formDataState.editCommunityInfo === "owner-only" ? true : false}>Owner only</option>
                                        <option value="admins-only" selected={formDataState.editCommunityInfo === "admins-only" ? true : false}>Admins only</option>
                                        <option value="members-only" selected={formDataState.editCommunityInfo === "members-only" ? true : false}>Members only</option>
                                    </select>
                                    <div className="message">Specify who can change the community details like the community name, community description. Default value is 'owner only'.</div>
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
                                    <div className="message">Secify who can send messages in the community. Default value is 'members'</div>
                                </dd>
                            </dl>
                        </div>
                    </Slider>
                </form>
            </div>
        </div>
    );
}
 
export default NewCommunityForm;