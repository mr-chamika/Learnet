import Profile from "../Profile/Profile";
import "./Topbar.css"
import logo from "../../Assets/learnet_compressed.png"
import Link from "../../Router/Link";
import { useContext } from "../../../react_lite/createDOM";
import { themeContext } from "../../Contexts/ThemeContext";

const Topbar = () => {

    const {toggleTheme} = useContext(themeContext)

    return ( 
        <div className="topbar">
            <Link to="/user" className="logo"><img src={logo} alt="" />LEARNET</Link>
            {/* <form>
                <input type="text" value="" name="search" placeholder="Search"/>
            </form> */}
            {/* <button className="icon-button" onClick={toggleTheme}>Theme toggle</button> */}
            <Profile />
        </div>
     );
}
 
export default Topbar;