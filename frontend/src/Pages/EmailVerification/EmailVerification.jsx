import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import Navbar from "../../Components/Navbar/Navbar";
import OTPExpirationTimer from "./OTPExpirationTimer";

const EmailVerification = () => {
    const [otp, setOtp] = useState("")
    const [isError, setIsError] = useState(false)
    const [resenButtonDisabled, setResetButtonDisabled] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const { goto, params } = useContext("router")
    const {id} = params

    const OTPVerificationHandler = (e) => {
        e.preventDefault()

        if (!otp) {
            setIsError(true)
            setError("Please enter the OTP.")
            return
        }

        const email = localStorage.getItem("email")
        fetch("http://localhost:8080/user/verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        })
            .then((res) => res.json())
            .then((data) => {
                // if (!data.error) {
                //     console.log("OTP verified successfully:")
                //     // Navigate to the next page or dashboard
                //     goto("/user/dashboard")
                // } else {
                //     setIsError(true)
                //     setError(data.error)
                // }
                if(data.token){
                    console.log(data)
                    localStorage.setItem("name", data.name)
                    localStorage.setItem("email", data.email)
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("userId", data.userId)
                    goto("/user")
                }else{
                    setIsError(true)
                    setError(data.error)
                }
            })
            .catch((err) => {
                console.error("Error verifying OTP:", err)
                setIsError(true)
                setError("Failed to verify OTP. Please try again.")
            })
    };

    const resendOtpHandler = () => {
        fetch("http://localhost:8080/user/get-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: localStorage.getItem("email") }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMessage(data.message)
                    if(data.success === 'OTP sent successfully.'){
                        restTimer(Date.now())
                        setResetButtonDisabled(true)
                    }
                    setTimeout(() => {
                        setResetButtonDisabled(false)
                    }, 60000);
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

    
    const [resetValue, restTimer] = useState(false)
    
    useEffect(()=>{
        restTimer(Date.now())
    }, [id])

    return (
        <div>
            <Navbar />
            <div className="login-signup cont">
                <div className="box">
                    <div className="form">
                        <h2>Verify Your Account</h2>
                        <p>
                            Please enter the One-Time Password (OTP) sent to your email to complete the signup process.
                        </p>
                        <form onSubmit={OTPVerificationHandler}>
                            <input
                                name="otp"
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            {isError && (<div className="error">{error}</div>)}
                            {message && (<div className="message">{message}</div>)}
                            <input type="submit" value="Verify" />
                        </form>
                        <div className="message">
                            <span>Didn't receive the OTP? </span>
                        </div>
                            <button disabled={resenButtonDisabled} className="icon-button cancel" onClick={resendOtpHandler}>Resend OTP</button>
                        <OTPExpirationTimer resetValue={resetValue} duration={300} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
