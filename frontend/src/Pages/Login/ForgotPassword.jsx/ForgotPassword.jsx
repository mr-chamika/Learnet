// import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
// import Navbar from "../../Components/Navbar/Navbar";
// import Link from "../../Router/Link";
// import updateFormData from "../../Util/updateFormData";
// import { focusNext } from "../../Util/FormFocusNext";
// import { UserContext } from "../../Contexts/UserContext";

import { useContext, useEffect, useState } from "../../../../react_lite/createDOM"
import Navbar from "../../../Components/Navbar/Navbar"
import { UserContext } from "../../../Contexts/UserContext"
import Link from "../../../Router/Link"
import { formDataToObj } from "../../../Util/FormDataToObj"
import { focusNext } from "../../../Util/FormFocusNext"
import updateFormData from "../../../Util/updateFormData"

const ForgotPassword = () => {

    const [formDataState, setFormDataState] = useState({
        email: "",
        otp: "",
        newPassword: "",
        cnewPassword: ""
    })
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const [otpMessage, setOtpMessage] = useState("")
    const {goto, key} = useContext("router")
    const {setUser} = useContext(UserContext)
    const [verifyEmail, setVerifyEmail] = useState(false)

    const changePasswordHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const email = data.email
        const password = data.newPassword
        const otp = data.otp

        fetch("http://localhost:8080/user/change-pw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, 
                newPassword: password,
                otp
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
        // focusNext(document.querySelector("form"), name)
    }

    useEffect(() => {
        setFormDataState({
            email: "",
            otp: "",
            newPassword: "",
            cnewPassword: ""
        })
    }, [key])

    const getVerificationCode = (e) => {
        e.stopPropagation()
        e.preventDefault()
        fetch("http://localhost:8080/user/get-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formDataState.email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOtpMessage(data.success)
                    // if(data.success === 'OTP sent successfully.'){
                    //     restTimer(Date.now())
                    //     setResetButtonDisabled(true)
                    // }
                    // setTimeout(() => {
                    //     setResetButtonDisabled(false)
                    // }, 60000);
                } else {
                    setIsError(true)
                    setError(data.error)
                }
            })
            .catch((err) => {
                console.error("Error resending OTP:", err)
                setIsError(true)
                setError("Failed to resend OTP. Please try again.")
            })
    }

    return (
        <div>
            <Navbar />
            <div className="login-signup login cont">
                <div className="box">
                    <div className="form">
                        <div className="heading">
                            <h2>Reset password</h2>
                            <p>Enter the email and obtain an OTP, and change the password.</p>
                        </div>
                        <form onSubmit={changePasswordHandler} onChange={onChange}>
                            <label for="email"><span>Email</span><input name="email" type="email" placeholder="Email address" value={formDataState.email} /></label>
                            <label for="email"><span>OTP</span><input name="otp" type="text" placeholder="Enter OTP" value={formDataState.otp} /><button onClick={getVerificationCode} className="icon-button">Get OTP</button></label>
                            {otpMessage && (<div className="message">{otpMessage}</div>)}
                            <label for="password"><span>New Password</span><input name="newPassword" type="password" placeholder="Enter new Password" value={formDataState.newPassword} /></label>
                            {/* <label for="password"><span>Confirm Password</span><input name="cnewPassword" type="password" placeholder="Re enter Password" value={formDataState.cnewPassword} /></label> */}
                            <input className="icon-button" type="submit" value="Change Password" />
                        </form>
                        {error && (<div className="error">{error}</div>)}
                        {verifyEmail && (<div className="message"><span>Verify email </span><Link to="/signup/email-verification" label="click here"/></div>)}
                        {!verifyEmail && (<div className="message"><span>Create an account? </span><Link to="/signup" label="click here"/></div>)}
                        {!verifyEmail && (<div className="message"><span>Already have an account? </span><Link to="/login" label="Click here"/></div>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;