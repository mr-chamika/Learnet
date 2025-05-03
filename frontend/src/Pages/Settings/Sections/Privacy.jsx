import { useState } from "../../../../react_lite/createDOM";

const PrivacySettings = ({isActive}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    return ( 
        <div className={`sections-container ${isActive ? "active" : ""}`}>
            <div className="section">
                <div className="heading">
                    Profile Privacy
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Who Can View My Profile (Public/Friends Only/Custom)</label>
                        </dt>
                        <dd className="input">
                            <input type="text" value="Gishan" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Who Can See My Profile photo (Likes, Comments, etc.)</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Only me</option>
                            </select>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Profile visibility</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Only me</option>
                            </select>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </dd>
                    </dl>
                    <div className="message">
                        All of the fields on this section are required, and by filling them out, you're giving us consent to share this data wherever your user profile appears. Please see our privacy statement to learn more about how we use this information.
                    </div>
                    <div className="form-bottom-buttons">
                        <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                        <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                    </div>
                </form>
            </div>
            <div className="section">
                <div className="heading">
                    Post Privacy
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Default Post Privacy (Public/Friends Only/Custom)</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Only me</option>
                            </select>
                            <div className="message">Learnet will use your selected theme.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Tagging (Who can tag you in posts)</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Only me</option>
                            </select>
                            <div className="message">Learnet will use your selected theme.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Mentions (Who can mention you)</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Only me</option>
                            </select>
                            <div className="message">Learnet will use your selected theme.</div>
                        </dd>
                    </dl>
                    <div className="form-bottom-buttons">
                        <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                        <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                    </div>
                </form>
            </div>
            <div className="section">
                <div className="heading">
                    Messaging Privacy
                </div>
                <form className="items-container">
                    <div className="item">
                        <span>Who Can Message Me (Everyone/Friends Only/No One)</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Message Requests (Filter and manage requests)</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Read Receipts (Enable/Disable)</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                    <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                </form>
            </div>
            <div className="section">
                <div className="heading">
                    Blocking
                </div>
                <form className="items-container">
                    <div className="item">
                        <span>Blocked Users</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Blocked Words/Topics</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                    <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                </form>
            </div>
        </div>
     );
}
 
export default PrivacySettings;