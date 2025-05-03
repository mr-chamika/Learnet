import Profile from "../Profile/Profile";
import "./Topbar.css"
import logo from "../../Assets/learnet_compressed.png"
import Link from "../../../../frontend/src/Router/Link";

const Topbar = () => {

    return ( 
        <div className="topbar">
            <Link to="/admin" className="logo"><img src={logo} alt="" />LEARNET</Link>
            <form>
                <input type="text" value="" name="search-top" placeholder="Search"/>
            </form>
            <Profile />
        </div>
     );
}
 
export default Topbar;