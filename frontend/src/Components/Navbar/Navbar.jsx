import Link from "../../Router/Link";
import logo from "../../Assets/learnet_compressed.png"
import "./Navbar.css"
import { useContext } from "../../../react_lite/createDOM";
import { themeContext } from "../../Contexts/ThemeContext";

const Navbar = () => {

    const {toggleTheme} = useContext(themeContext)

    return ( 
        <div className="navbar cont">
            <div className="box">
                {/* <div className="left"><Link to="/" label="LEARNET" /></div> */}
                <Link to="/" className="logo"><img src={logo} alt="" />LEARNET</Link>
                <div className="right">
                    <button className="outline-button" onClick={toggleTheme}>Theme toggle</button>
                    <div><Link className="outline-button" to="/login"><span>Login</span></Link></div>
                    <div><Link className="icon-button" to="/signup"><span>Signup</span></Link></div>
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;