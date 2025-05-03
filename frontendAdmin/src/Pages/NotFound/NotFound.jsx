// import Navbar from "../../Components/Navbar/Navbar";
import Topbar from "../../Components/Topbar/Topbar";
import "./NotFound.css"

const NotFound = () => {
    return ( 
        <div>
            <div className="cont">
                <div className="box">
                    <Topbar />
                </div>
            </div>
            <div className="not-found cont">
                <div className="box">
                    <div className="title">Not Found 404</div>
                    <div className="description">page you searched cannot be found.</div>
                    <button className="icon-button">Go back</button>
                </div>
            </div>
        </div>
     );
}
 
export default NotFound;