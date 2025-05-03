import "./Signup.css"
import Navbar from "../../Components/Navbar/Navbar";
import Link from "../../../../frontend/src/Router/Link";
import { useContext, useState } from "../../../../frontend/react_lite/createDOM";
import { formDataToObj } from "../../Util/FormDataToObj";

const Signup = () => {

    // const isError = false
    // const error = "Error"
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const {goto} = useContext("router")


    const SignupHandler = (e) => {
        // console.log("signing up")
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        // console.log("data : ", data)
        // const inputs = e.target.getElementsByTagName("input")
        // const name = inputs.name.value
        // const email = inputs.email.value
        // const password = inputs.password.value

        const name = data.name
        const email = data.email
        const phone = data.phone
        const password = data.password
        const uid = data.uid
        const concent = data.concent
        const uidImage = data["uid-image"]

        console.log(name, email, phone, password, uid, concent, uidImage)

        fetch("http://localhost:8080/user/signup", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name, email, phone, uid, concent, password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // if(!data.error){
            //     console.log(data)
            //     localStorage.setItem("name", data.name)
            //     localStorage.setItem("email", data.email)
            //     localStorage.setItem("token", data.token)
            //     goto("/user")
            // }else{
            //     setIsError(true)
            //     setError(data.error)
            // }
            if(data.email){
                localStorage.setItem("name", data.name)
                localStorage.setItem("email", data.email)

                setTimeout(() => {
                    fetch("http://localhost:8080/user/get-otp", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: data.email }),
                    })
                }, 100);

                goto("/signup/email-verification")
            }else{
                setIsError(true)
                setError(data.error)
            }
        })
        .catch(err=>console.log(err))
    }

    return ( 
        <div>
            <Navbar />
            <div className="login-signup signup cont">
                <div className="box">
                    <div className="form">
                        <div className="heading">
                            <h2>Signup</h2>
                            <p>Enter your details below, you have to sign up with your university email.</p>
                        </div>
                        <form onSubmit={SignupHandler}>
                            <input name="name" type="text" placeholder="Your name" />
                            <input name="email" type="email" placeholder="Email address" />
                            <input name="phone" type="tel" placeholder="Phone number" />
                            <input name="password" type="password" placeholder="Password" />
                            <input name="uid" type="text" placeholder="University ID number" />
                            <div className="check-field"><input name="concent" type="checkbox" value="true" /><label for="concent">By continuing, I agree to the terms of use & privacy policy</label></div>
                            <label for="uid-image"><span>It is essential to upload an image of your university ID to verify your details and for future use</span><input name="uid-image" type="file" accept="image/jpg,image/jpeg,image/png"/></label>
                            {isError && (<div className="error">{error}</div>)}
                            <input type="submit" value="Continue" />
                        </form>
                        <div className="message"><span>Already have an account? </span><Link to="/login" label="Click here"/></div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Signup
;