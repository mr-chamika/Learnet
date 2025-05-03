import { useContext, useState } from "../../../../react_lite/createDOM";
import { formDataToObj } from "../../../Util/FormDataToObj";
import updateFormData from "../../../Util/updateFormData";
import { UserContext } from "../../../Contexts/UserContext";

const CreateReportPopup = ({contentId, contentType}) => {

    const {user} = useContext(UserContext)
    const [formDataState, setFormDataState] = useState({
        reason: "",
        description: ""
    })
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")

    // contentId, contentType, reason, description

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const reason = data.reason
        const description = data.description

        fetch("http://localhost:8080/report/auth/create",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                contentId,
                contentType,
                reason,
                description
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("report : ", data)
            if(!data.error){
                setFormDataState({
                    reason: "",
                    description: ""
                })   
            }else{
                setError(data.error)
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                    setError("")
                }, 5000);
            }
        })

    }

    const onChange = (e) =>{
        updateFormData(e, setFormDataState)
    }

    return ( 
        <div className="create-new-group-popup">
            <div className="section">
                <div className="heading">
                    Report
                </div>
                <form onSubmit={submitHandler} onChange={onChange}>
                    <div className="items-container">
                        <dl className="item">
                            <dt className="title">
                                <label for="">Reason</label>
                            </dt>
                            <dd className="input">
                                <select name="reason" value={formDataState.reason}>
                                    <option value="AcademicIntegrityViolation" selected={formDataState.reason === "AcademicIntegrityViolation" ? true : false}>Academic Integrity Violation</option>
                                    <option value="CopyrightViolation" selected={formDataState.reason === "CopyrightViolation" ? true : false}>Copyright Violation</option>
                                    <option value="Inappropriate" selected={formDataState.reason === "Inappropriate" ? true : false}>Inappropriate Content</option>
                                    <option value="Misinformation" selected={formDataState.reason === "Misinformation" ? true : false}>Misinformation</option>
                                    <option value="Spam" selected={formDataState.reason === "Spam" ? true : false}>Spam</option>
                                    <option value="Harassment" selected={formDataState.reason === "Harassment" ? true : false}>Harassment</option>
                                </select>
                                <div>
                                    <div className="message">Academic Integrity Violation - Unethical learning behavior like plagiarism, cheating, or submitting others' work as your own</div>
                                    <div className="message">Copyright Violation - Unauthorized use of copyrighted textbooks, course materials, or creative works</div>
                                    <div className="message">Inappropriate Content - Offensive, explicit, hateful, or non-educational material</div>
                                    <div className="message">Misinformation - Factually incorrect explanations or scientifically unsupported claims presented as truth</div>
                                    <div className="message">Spam - Commercial ads, repetitive posts, or unauthorized links unrelated to education</div>
                                    <div className="message">Harassment - Personal attacks, threats, or targeted discrimination against individuals/groups</div>
                                </div>
                            </dd>
                        </dl>
                        <dl className="item">
                            <dt className="title">
                                <label for="">Description</label>
                            </dt>
                            <dd className="input">
                                <textarea name="description" value={formDataState.description}></textarea>
                                <div className="message">Provide a description on the report</div>
                            </dd>
                        </dl>
                        {isError && (<div className="error">{error}</div>)}
                        <button type="submit" className="icon-button">Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default CreateReportPopup;