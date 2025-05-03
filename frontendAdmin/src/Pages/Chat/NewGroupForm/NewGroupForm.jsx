import ChatBox from "../../../Components/ChatBox/ChatBox";
import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/icons/search.svg"
import { useState } from "../../../../react_lite/createDOM";
import uploadAreaIcon from "../../../Assets/icons/upload_area.svg"

import "./NewGroupForm.css"

const NewGroupForm = () => {

    const [image, setImage] = useState(false)

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const selectedMemberCount = 0
    const maxMemberCount = 100

    return ( 
        <div className="new-group">
            <form>
                <caption>Create a New Group</caption>
                <Slider width="500px" height="700px">
                    <div>
                        {/* <label for=""><span>Group Image: </span><input name="group-image" type="file" value="" accept="image/jpg,image/png,image/jpeg"/></label> */}
                        <div className="col">
                            <div className="itemfield">
                                <label htmlFor="file-input">
                                    <img src={image ? URL.createObjectURL(image) : uploadAreaIcon} className='itemfield-image' alt="" />
                                </label>
                                <input onChange={(e)=>imageHandler(e)} type="file" name='itemImage' id='file-input' accept="image/jpg,image/png,image/jpeg" title="profile picture"/>
                            </div>
                            <input name="group-name" type="text" value="" placeholder="Group name"/>
                        </div>
                        {/* <label for=""><span>Group Description: </span> */}
                        <textarea name="group-description" type="text" value="" placeholder="Group description"></textarea>
                        {/* </label> */}
                    </div>
                    <div>
                        <div className="select-members">
                            <div className="topbar">
                                <div className="title">Select members</div>
                                <div className="sub">{selectedMemberCount} of {maxMemberCount} selected</div>
                                <div className="search">
                                    <input type="text" name="search" value=""></input>
                                    <div className="search-icon">
                                        <img src={searchIcon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="selected-users">
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                                <div className="selected-user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-name">Randila</div>
                                </div>
                            </div>
                            <div className="contact-list">
                                {/* <div className="user">
                                    <div className="profile-image">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="right">
                                        <div className="user-name">Senesh</div>
                                        <div className="user-description">Hello there!</div>
                                    </div>
                                </div> */}
                                {/* <ChatBox 
                                    key={0}
                                    type="details"
                                    name="gm"
                                    description="Hey there!"
                                />
                                <ChatBox 
                                    key={0}
                                    type="details"
                                    name="gm"
                                    description="Hey there!"
                                />
                                <ChatBox 
                                    key={0}
                                    type="details"
                                    name="gm"
                                    description="Hey there!"
                                /> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        Group permissions
                        Members Can:
                                Edit goup settings
                    </div>
                </Slider>
            </form>
        </div>
     );
}
 
export default NewGroupForm;