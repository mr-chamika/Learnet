import "./Logout.css"
import { useContext, useState } from "../../../react_lite/createDOM";
import Navbar from "../../Components/Navbar/Navbar";
import Link from "../../Router/Link";

const Login = () => {

    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")

    const LoginHandler = (e) => {
        e.preventDefault()
        localStorage.removeItem("name")
        localStorage.removeItem("email")
        localStorage.removeItem("token")
        goto("/login")
    }

    return ( 
        <div>
            <Navbar />
            <div className="login-signup logout cont">
                <div className="box">
                    <div className="form">
                        <div className="heading">
                            <h2>Need to logout?</h2>
                            <p>"You're about to log out. Make sure to save any ongoing work or changes before leaving. We’ll be here when you’re ready to come back!"</p>
                        </div>
                        <form onSubmit={LoginHandler}>
                            <input type="submit" value="Logout" />
                        </form>
                        {isError && (<div className="error-message">{error}</div>)}
                        <div className="message"><span>Create an account? </span><Link to="/signup" label="Click here"/></div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Login;