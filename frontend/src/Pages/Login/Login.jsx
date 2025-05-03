import "./Login.css"
import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import Navbar from "../../Components/Navbar/Navbar";
import Link from "../../Router/Link";
import updateFormData from "../../Util/updateFormData";
import { focusNext } from "../../Util/FormFocusNext";
import { UserContext } from "../../Contexts/UserContext";

const Login = () => {

    const [formDataState, setFormDataState] = useState({
        email: "",
        password: ""
    })
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const {goto, key} = useContext("router")
    const {setUser} = useContext(UserContext)
    const [verifyEmail, setVerifyEmail] = useState(false)

    const LoginHandler = (e) => {
        e.preventDefault()
        const inputs = e.target.getElementsByTagName("input")
        const email = inputs.email.value
        const password = inputs.password.value

        fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    console.log(data)
                    localStorage.setItem("name", data.name)
                    localStorage.setItem("email", data.email)
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("userId", data.userId)
                    setUser({ name: data.name, email: data.email, token: data.token, userId: data.userId })
                    setTimeout(() => {
                        goto("/user")
                    }, 1000);
                } else {
                    setIsError(true)
                    setError(data.error)
                    if (data.error.trim() === "The email address associated with your account has not yet been verified. You will be unable to log in until it is verified.") {
                        localStorage.setItem("email", email)
                        setVerifyEmail(true)
                    }
                    setTimeout(() => {
                        setError(false)
                        console.log("reset---------------------------")
                    }, 10000);
                }
            })
            .catch(err => console.log(err))
    }

    const onChange = (e) => {
        const name = e.target.name
        updateFormData(e, setFormDataState)
        focusNext(document.querySelector("form"), name)
    }

    useEffect(() => {
        setFormDataState({
            email: "",
            password: ""
        })
    }, [key])

    return (
        <div>
            <Navbar />
            <div className="login-signup login cont">
                <div className="box">
                    <div className="form">
                        <div className="heading">
                            <h2>Welcome Back!</h2>
                            <p>Enter the login credentials below</p>
                        </div>
                        <form onSubmit={LoginHandler} onChange={onChange}>
                            <label for="email"><span>Email</span><input name="email" type="email" placeholder="Email address" value={formDataState.email} /></label>
                            <label for="password"><span>Password</span><input name="password" type="password" placeholder="Password" value={formDataState.password} /></label>
                            <input className="icon-button" type="submit" value="Login" />
                        </form>
                        {error && (<div className="error">{error}</div>)}
                        <div className="message"><span>Forgot password ? </span><Link to="/forgot-password" label="reset password"/></div>
                        {verifyEmail && (<div className="message"><span>Verify email </span><Link to="/signup/email-verification" label="click here"/></div>)}
                        {!verifyEmail && (<div className="message"><span>Create an account? </span><Link to="/signup" label="click here"/></div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;