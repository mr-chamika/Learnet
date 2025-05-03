import { useState } from "../../../../react_lite/createDOM";

const ContentSettings = ({isActive}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    return ( 
        <div className={`sections-container ${isActive ? "active" : ""}`}>
            <div className="section">
                <div className="heading">
                    Content Preferences
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Feed Preferences</label>
                        </dt>
                        <dd className="input">
                            <input type="text" value="Gishan" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Tags of interest</label>
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
                            <label for="">Content reposting</label>
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
                    Data Usage
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Data saver mode</label>
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
        </div>
     );
}
 
export default ContentSettings;