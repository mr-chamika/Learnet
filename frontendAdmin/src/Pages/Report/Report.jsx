import { useContext, useEffect, useState } from "../../../../frontend/react_lite/createDOM";
import { getDate } from "../../../../frontend/src/Util/TimeDate";
import Card from "../../Components/Card/Card";
import PopupBox, { openPopup } from "../../Components/PopupBox/PopupBox";
import { UserContext } from "../../Contexts/UserContext";
import { formDataToObj } from "../../Util/FormDataToObj";
import updateFormData from "../../Util/updateFormData";
import ActionForm from "./ActionPopup/ActionPopup";
import "./Report.css"

const ReportPage = () => {

    const {user} = useContext(UserContext)
    const [reports, setReports] = useState([])
    const [resolvedReports, setResolvedReports] = useState([])

    const fetchReports = () => {
        fetch("http://localhost:8080/report/moderator/get", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            // body: JSON.stringify({

            // })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("reports fetched : ", data)
            if(!data.error){
                setReports(data.sort((a, b)=>b.priority - a.priority))
            }
        })
    }

    useEffect(()=>{
        fetchReports()
    }, [user])

    const actionPopupHandler = (e) => {
        e.stopPropagation()
        openPopup(document.querySelector(".report-page .popup-box.action"))
    }

    const updateReports = (report) => {
        setReports(prev=>{
            const updated = prev.map(v=>{
                if(v._id === report._id){
                    return report
                }else{
                    return v
                }
            })
            return [...updated]
        })
        // setResolvedReports(report)
    }

    const [activeTab, setActiveTab] = useState("Open")

    let reportsToShow
    if(activeTab === "Open"){
        reportsToShow = reports
    }else{
        reportsToShow = resolvedReports
    }

    return ( 
        <div className="report-page">
            <div className="topbar">
                <div className="left">
                    <button 
                        className={`tab-button ${activeTab === "Open" ? "active" : ""}`} 
                        onClick={()=>setActiveTab("Open")}
                    >
                        Open
                    </button>
                    <button 
                        className={`tab-button ${activeTab === "Resolved" ? "active" : ""}`} 
                        onClick={()=>setActiveTab("Resolved")}
                    >
                        Resolved
                    </button>
                </div>
                <div className="right" onClick={()=>fetchReports()}>
                    <button className="icon-button">Reload</button>
                </div>
            </div>
            <PopupBox className="action" key="1">
                <ActionForm />
            </PopupBox>
            {
                reportsToShow.length > 0 ? (
                    <div className="reports">
                        {
                            reportsToShow.map((report, index)=>{
                                return (
                                    <ReportCard report={report} key={report._id} onAction={actionPopupHandler} updateReports={updateReports}/>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className="no-reports center-aligned-message-container">
                        <div className="center-aligned-message">
                            No reports to show
                        </div>
                    </div>
                )
            }
        </div>
     );
}
 
export default ReportPage;

const ReportCard = ({report, onAction, updateReports}) => {

    const at = getDate(report.createdAt)
    const {user} = useContext(UserContext)
    const [content, setContent] = useState(null)
    const [error, setError] = useState("")
    const [formDataState, setFormDataState] = useState({
        comment: "",
        decision: ""
    })

    useEffect(()=>{
        fetch("http://localhost:8080/content/get",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                contentId: report.contentId,
                contentType: report.contentType
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)
            if(!data.error){
                data.type = report.contentType
                setContent(data)
            }
        })
    }, [user])

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
                reportId: report._id,
                decision,
                comment
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("report action res : ", data)
            if(!data.error){
                console.log("report : ", report)
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

    useEffect(()=>{
        const prevVote = report.votes.find(v=>v.moderator === user.userId)
        if(prevVote){
            setFormDataState({
                decision: prevVote.decision,
                comment: prevVote.comment
            })
        }
    },[report])

    return (
        <div className="report-card">
            <div className="report-card-left">
                <div className="report-card-row">
                    <div className="report-card-reporter">
                        <div className="report-card-reputation-score">
                            {report.reporter.reputation.reputationScore}
                        </div>
                        <div className="report-card-item report-card-name">
                            {report.reporter.name}
                        </div>
                    </div>
                </div>
                <div className="report-card-row">
                    <div className="report-card-item report-card-reason">
                        <div className="report-card-item-title">
                            Reason
                        </div>
                        <div className="report-card-item-value">
                            {report.reason}
                        </div>
                    </div>
                    <div className="report-card-item right report-card-content-type">
                        <div className="report-card-item-title">
                            Content type
                        </div>
                        <div className="report-card-item-value">
                            {report.contentType}
                        </div>
                    </div>
                </div>
                <div className="report-card-row">
                    <div className="report-card-item report-card-description">
                        <div className="report-card-item-title">
                            Description
                        </div>
                        <div className="report-card-item-value">
                            {report.description}
                        </div>
                    </div>
                </div>
                <div className="report-card-row">
                    <div className="report-card-item report-card-priority">
                        <div className="report-card-item-title">
                            Priority
                        </div>
                        <div className="report-card-item-value">
                            {report.priority}
                        </div>
                    </div>
                    <div className={`report-card-item right report-card-severity ${report.severity}`}>
                        <div className="report-card-item-title">
                            Severity
                        </div>
                        <div className="report-card-item-value">
                            {report.severity}
                        </div>
                    </div>
                </div>
                <div className="report-card-row">
                    <div className="report-card-item report-card-final-decision">
                        <div className="report-card-item-title">
                            Status
                        </div>
                        <div className="report-card-item-value">
                            {report.finalDecision}
                        </div>
                    </div>
                    <div className="report-card-item right report-card-created-at">
                        <div className="report-card-item-title">
                            Created On
                        </div>
                        <div className="report-card-item-value">
                            {at}
                        </div>
                    </div>
                </div>
                <div className="report-card-action">
                    <form onSubmit={submitHandler} onChange={onChange}>
                        <fieldset>
                            <legend>Action Taken</legend>
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
                                    </dd>
                                </dl>
                                <dl className="item">
                                    <dt className="title">
                                        <label for="">Comment</label>
                                    </dt>
                                    <dd className="input">
                                        <textarea name="comment" value={formDataState.comment}></textarea>
                                    </dd>
                                </dl>
                                {error && (<div className="error">{error}</div>)}
                                <button className="icon-button" type="submit">Vote</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
            <div className="report-card-right">
                <div className="report-card-content">
                    {content && (<Card data={content} />)}
                </div>
            </div>
        </div>
    );
}