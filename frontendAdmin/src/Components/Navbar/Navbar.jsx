import Link from "../../../../frontend/src/Router/Link";
import logo from "../../Assets/learnet_compressed.png"
import "./Navbar.css"

const Navbar = () => {
    return ( 
        <div className="navbar cont">
            <div className="box">
                {/* <div className="left"><Link to="/" label="LEARNET" /></div> */}
                <Link to="/" className="logo"><img src={logo} alt="" />LEARNET</Link>
                <div className="right">
                    <Link className="icon-button" to="/login" label="Login" />
                    <Link className="icon-button" to="/signup" label="Signup" />
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;