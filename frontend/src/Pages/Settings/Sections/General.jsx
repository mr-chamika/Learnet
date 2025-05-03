import { useState } from "../../../../react_lite/createDOM";

const GeneralSettings = ({isActive}) => {

    const [currEdit, setCurEdit] = useState(null)
    const [passwordChangeFieldVisible, setPasswordChangeFieldVisible] = useState(false)

    const onChangePasswordClick = (e) => {
        e.preventDefault()
        setPasswordChangeFieldVisible(true)
    }

    const onPasswordSave = (e) => {
        e.preventDefault()
        setPasswordChangeFieldVisible(false)
    }

    return ( 
        <div className={`sections-container ${isActive ? "active" : ""}`}>
            <div className="section">
                <div className="heading">
                    Profile
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
                            <label for="">Bio</label>
                        </dt>
                        <dd className="input">
                            <textarea type="text" value=""></textarea>
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Profile picture</label>
                        </dt>
                        <dd className="input">
                            <input type="file" value="" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Cover picture</label>
                        </dt>
                        <dd className="input">
                            <input type="file" value="" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">User name</label>
                        </dt>
                        <dd className="input">
                            <input type="text" value="" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Email address</label>
                        </dt>
                        <dd className="input">
                            <input type="email" value="" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Phone number</label>
                        </dt>
                        <dd className="input">
                            <input type="phone" value="" />
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
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
                    Appearance
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Theme mode</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Dark</option>
                                <option>Light</option>
                                <option>System default</option>
                            </select>
                            <div className="message">Learnet will use your selected theme.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Font</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Dark</option>
                                <option>Light</option>
                                <option>System default</option>
                            </select>
                            <div className="message">Learnet will use your selected theme.</div>
                        </dd>
                    </dl>
                    <dl className="item">
                        <dt className="title">
                            <label for="">Layout</label>
                        </dt>
                        <dd className="input">
                            <select>
                                <option>Dark</option>
                                <option>Light</option>
                                <option>System default</option>
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
                    Account
                </div>
                <form className="items-container">
                    <div className="item">
                        <span>Deactivate Account</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Delete account</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Download My Data (Export profile, messages, and media)</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="form-bottom-buttons">
                        <button className="edit-button" onClick={()=>setCurEdit("account")}>Edit</button>
                        <button className="save-button" onClick={()=>setCurEdit(null)}>Save</button>
                    </div>
                </form>
            </div>
            <div className="section">
                <div className="heading">
                    Password & Security
                </div>
                <form className="items-container">
                    <dl className="item">
                        <dt className="title">
                            <label for="">Password</label>
                        </dt>
                        <dd className="input">
                            {!passwordChangeFieldVisible && (<button onClick={onChangePasswordClick}>Change password</button>)}
                            {passwordChangeFieldVisible && (
                                <div>
                                    <label for="">Current password</label><input type="password" />
                                    <label for="">New password</label><input type="password" />
                                    <label for="">Reenter new password</label><input type="password" />
                                    <div>
                                        <button className="save-button" onClick={onPasswordSave}>Save</button>
                                    </div>
                                </div>
                            )}
                            <div className="message">Your name may appear around Learnet with the contents you publish and on your profile.</div>
                        </dd>
                    </dl>
                    <div className="item">
                        <span>Two factor authentication</span>
                        <div className="form-checkbox">
                            <input type="checkbox"/>
                            <label for="">Specify whether</label>
                            <div className="message">Specify whether you want to show your profile through the feed.</div>
                        </div>
                    </div>
                    <div className="item">
                        <span>Login activity</span>
                        {currEdit !== "account" && (<span>Gishan</span>)}
                        {currEdit === "account" && (<input type="text" value="Gishan"></input>)}
                    </div>
                    <div className="item">
                        <span>Security quesions</span>
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
 
export default GeneralSettings;