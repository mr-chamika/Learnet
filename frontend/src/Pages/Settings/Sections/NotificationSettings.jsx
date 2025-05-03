import { useState } from "../../../../react_lite/createDOM";

const NotificationSettings = ({isActive}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    return ( 
        <div className={`sections-container ${isActive ? "active" : ""}`}>
            <div className="section">
                <div className="heading">
                    Email Notifications
                </div>
                <form className="items-container">
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Likes</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Comments</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Messages</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Friend requests</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Events</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Reminders</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Account updates</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Friend activities</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Group activities</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
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
                    In-App Notifications
                </div>
                <form className="items-container">
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Likes</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Comments</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Messages</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Friend requests</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Events</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Reminders</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Account updates</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Friend activities</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </dl>
                    <dl className="item">
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Group activities</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
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
        </div>
     );
}
 
export default NotificationSettings;