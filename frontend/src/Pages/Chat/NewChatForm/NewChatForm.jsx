import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/home.svg"
import ChatBox from "../../../Components/ChatBox/ChatBox";
import { useContext, useState } from "../../../../react_lite/createDOM";
import updateFormData from "../../../Util/updateFormData";
import { formToObj } from "../../../Util/FormDataToObj";
import { UserContext } from "../../../Contexts/UserContext";
import FriendSelectionBox from "../../../Components/FriendSelectionBox/FriendSelectionBox";

const NewChatForm = ({socket}) => {

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
        const friendId = JSON.parse(data.selectedUser)[0]
        // socket.send(JSON.stringify({type: "message", data: {receiverUserId: friendId, message: "Started the chat"}}))
        socket.send(JSON.stringify({type: "create-chat", data: {receiverUserId: friendId}}))


        // const email = data.email
        // console.log("socket : ", socket)

        // fetch("http://localhost:8080/user/get-one", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type" : "application/json"
        //     },
        //     body: JSON.stringify({
        //         email
        //     })
        // })
        // .then(res=>res.json())
        // .then(data=>{
        //     console.log("user : ", data)
        //     if(data._id){
        //         socket.send(JSON.stringify({type: "message", data: {receiverUserId: data._id, message: "Started the chat"}}))
        //     }else{
        //         // show error
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })

    }

    const onChange = (e) => {
        updateFormData(e, setFormDataState)
    }

    // const updateSelectionType = (e) => {
    //     e.stopPropagation()
    //     setSelectionType(e.target.value)
    // }

    return ( 
        <div className="create-new-chat-popup">
            <div className="section">
                <div className="heading">
                    Create a New Chat
                </div>
                {/* <div>
                    <label>
                        <span>Using friend list</span>
                        <input 
                            name="selectionType"
                            checked={selectionType === "friendlist"} 
                            value="friendlist" 
                            type="radio"
                            onChange={updateSelectionType}
                            onClick={e=>e.stopPropagation()}
                        />
                    </label>
                    <label>
                        <span>Using email</span>
                        <input 
                            name="selectionType"
                            checked={selectionType === "email"} 
                            value="email" 
                            type="radio"
                            onChange={updateSelectionType}
                            onClick={e=>e.stopPropagation()}
                        />
                    </label>
                </div> */}
                <form onSubmit={onSubmit} onChange={onChange}>
                    <FriendSelectionBox allowMultiple={false} inputName="selectedUser"/>
                    {/* { selectionType === "friendlist" ? (
                        ) : (
                            <label for="uid-image"><span>Email:</span><input name="email" type="email" placeholder="Email address" value={formDataState.email}/></label>
                        ) 
                    } */}
                    {isError && (<div className="error">{error}</div>)}
                    <input type="submit" value="Continue" />
                </form>
            </div>
        </div>
     );
}
 
export default NewChatForm;