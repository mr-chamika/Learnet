import { useState } from "../../../../react_lite/createDOM";

const ChatSettings = ({isActive}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    return ( 
        <div className={`sections-container ${isActive ? "active" : ""}`}>
            <div className="section">
                <div className="heading">
                    Account
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Name</label>
                        </dt>
                        <dd className="input">
                            <input type="text" value="Gishan" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
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
                    <dl className="item">
                        <dt className="title">
                            <label for="">Profile visibility</label>
                        </dt>
                        <dd className="input">
                            <textarea></textarea>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </dd>
                    </dl>
                    <div className="form-radio-group">
                        <div className="form-radio">
                            <input type="radio"/>
                            <label for="">Specify whether</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                        <div className="form-radio">
                            <input type="radio"/>
                            <label for="">Specify whether</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                        <div className="form-radio">
                            <input type="radio"/>
                            <label for="">Specify whether</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </div>
                    <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Specify whether</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
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
                    Theme
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Theme mode</label>
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
                    Theme
                </div>
                <form className="items-container">
                    <div className="item">
                        <span>Name</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Password</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                    <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                </form>
            </div>
            <div className="section">
                <div className="heading">
                    Theme
                </div>
                <form className="items-container">
                    <div className="item">
                        <span>Name</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Password</span>
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
 
export default ChatSettings;