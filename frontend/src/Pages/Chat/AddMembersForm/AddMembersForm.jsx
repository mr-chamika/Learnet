import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/home.svg"
import ChatBox from "../../../Components/ChatBox/ChatBox";
import { useContext, useState } from "../../../../react_lite/createDOM";
import updateFormData from "../../../Util/updateFormData";
import { formToObj } from "../../../Util/FormDataToObj";
import { UserContext } from "../../../Contexts/UserContext";
import FriendSelectionBox from "../../../Components/FriendSelectionBox/FriendSelectionBox";

const AddMembersForm = ({socket, currentChat}) => {

    const [formDataState, setFormDataState] = useState({
        email: ""
    })
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    // const [selectionType, setSelectionType] = useState("friendlist")

    const {user} = useContext(UserContext)

    const onSubmit = async (e) => {
        e.preventDefault()
        const data = await formToObj(e.target)
        const friendIds = JSON.parse(data.selectedUsers)
        const type = currentChat.type
        socket.send(JSON.stringify({
            type: `add-${type}-members`,
            data: {
                [`${type}Id`]: currentChat.chat._id,
                members: friendIds
            }
        }))
    }

    const onChange = (e) => {
        updateFormData(e, setFormDataState)
    }

    return ( 
        <div className="create-new-chat-popup">
            <div className="section">
                <div className="heading">
                    Add members
                </div>
                <form onSubmit={onSubmit} onChange={onChange}>
                    <FriendSelectionBox allowMultiple={true} inputName="selectedUsers"/>
                    {isError && (<div className="error">{error}</div>)}
                    <input type="submit" value="Continue" />
                </form>
            </div>
        </div>
     );
}
 
export default AddMembersForm;