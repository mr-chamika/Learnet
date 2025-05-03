import { useContext, useState } from "../../../../../frontend/react_lite/createDOM";

import { formDataToObj } from "../../../Util/FormDataToObj";
import updateFormData from "../../../Util/updateFormData";
import { UserContext } from "../../../Contexts/UserContext";

const ActionForm = ({updateReports}) => {

    const {user} = useContext(UserContext)
    const [formDataState, setFormDataState] = useState({
        comment: "",
        decision: ""
    })
    const [error, setError] = useState("")

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const decision = data.decision
        const comment = data.comment

        fetch("http://localhost:8080/report/moderator/vote",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                decision,
                comment
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("report action res : ", data)
            if(!data.error){
                updateReports(data)
            }else{
                setError(data.error)
                setTimeout(() => {
                    setError("")
                }, 5000);
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
                    Take Action
                </div>
                <form onSubmit={submitHandler} onChange={onChange}>
                    <div className="items-container">
                        <dl className="item">
                            <dt className="title">
                                <label for="">Decision</label>
                            </dt>
                            <dd className="input">
                                <select name="decision" value={formDataState.decision}>
                                    <option value="Approve" selected={formDataState.decision === "Approve" ? true : false}>Approve</option>
                                    <option value="Reject" selected={formDataState.decision === "Reject" ? true : false}>Reject</option>
                                    <option value="Pending" selected={formDataState.decision === "Pending" ? true : false}>Pending</option>
                                </select>
                                <div className="message">Public groups will be suggested to other users through the feed.</div>
                            </dd>
                        </dl>
                        <dl className="item">
                            <dt className="title">
                                <label for="">Comment</label>
                            </dt>
                            <dd className="input">
                                <textarea name="comment" value={formDataState.comment}></textarea>
                                <div className="message">Provide a comprehensive description on the note content. This field is important for public notes.</div>
                            </dd>
                        </dl>
                        {error && (<div className="error">{error}</div>)}
                        <button className="icon-button" type="submit">Vote</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default ActionForm;