import Slider from "../../../Components/Slider/Slider";
import img from "../../../Assets/grp.jpg"
import searchIcon from "../../../Assets/home.svg"
import ChatBox from "../../../Components/ChatBox/ChatBox";

const NewChatForm = () => {
    return ( 
        <div className="new-chat">
            <form>
                <caption>Create a New Chat</caption>
                <Slider width="500px" height="500px">
                    <div>
                        <label for=""><span>Group Name: </span><input name="group-name" type="text" value="" /></label>
                        <label for=""><span>Group Description: </span><input name="group-description" type="text" value="" /></label>
                        <label for=""><span>Group Image: </span><input name="group-image" type="text" value="" /></label>
                        <label for=""><input name="" type="text" value="" /></label>
                    </div>
                    <div>
                        <div className="select-members">
                            <div className="topbar">
                                <div className="title">New group</div>
                                <div className="sub">1 of 100 selected</div>
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
                                        {/* <img src={img} alt="" /> */}
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
                        <label for=""><span>kk Name: </span><input name="group-name" type="text" value="" /></label>
                        <label for=""><span>Group Description: </span><input name="group-description" type="text" value="" /></label>
                        <label for=""><span>Group Image: </span><input name="group-image" type="text" value="" /></label>
                        <label for=""><input name="" type="text" value="" /></label>
                    </div>
                </Slider>
            </form>
        </div>
     );
}
 
export default NewChatForm;