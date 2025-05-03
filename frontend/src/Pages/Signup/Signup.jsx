import "./Signup.css"
import Navbar from "../../Components/Navbar/Navbar";
import Link from "../../Router/Link";
import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { formDataToObj, formToObj } from "../../Util/FormDataToObj";
import updateFormData from "../../Util/updateFormData";
import readFileAsync from "../../Util/readFileAsync";
import { focusNext } from "../../Util/FormFocusNext";
import Slider from "../../Components/Slider/Slider";
import TagInputField from "../../Components/TagInputField/TagInputField";

const Signup = () => {

    const [formDataState, setFormDataState] = useState({
        name: "",
        username: "",
        bio: "",
        email: "",
        password: "",
        uid: "",
        phone: "",
    })
    const [concent, setConcent] = useState(false)

    // const isError = false
    // const error = "Error"
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const { goto, key } = useContext("router")
    console.log("key s : ", key)

    useEffect(() => {
        setFormDataState({
            name: "",
            username: "",
            bio: "",
            password: "",
            phone: "",
            email: "",
            university: "",
            uid: "",
            "uid-image": "",
            "profile-pic": "",
            correctDetails: false,
            concent: false
        })
    }, [key])

    const SignupHandler = async (e) => {
        // console.log("signing up")
        e.preventDefault()

        // const formData = new FormData(e.target)
        // const data = formDataToObj(formData)

        // const data = await formToObj(e.target)

        // console.log("data : ", data)
        // const inputs = e.target.getElementsByTagName("input")
        // const name = inputs.name.value
        // const email = inputs.email.value
        // const password = inputs.password.value

        // const name = data.name
        // const email = data.email
        // const phone = data.phone
        // const password = data.password
        // const uid = data.uid
        // const concent = data.concent
        // const uidImage = data["uid-image"]

        console.log("target: ", document.querySelector(".login-signup form"))

        const formData = new FormData(document.querySelector(".login-signup form"))
        // const tagsJson = formData.get("tags")
        // formData.delete("tags")
        // formData.append("tags", JSON.parse(tagsJson))
        console.log(formData.entries())
        // console.log(name, email, phone, password, uid, concent, uidImage)

        fetch("http://localhost:8080/user/signup", {
            method: "POST",
            // headers: {
            //     "Content-Type" : "application/json"
            // },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
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
                if (data.email) {
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

                    goto(`/signup/email-verification/${Date.now()}`)
                } else {
                    setIsError(true)
                    setError(data.error)
                    // const x = document.querySelector(".scroll")
                    // x.scrollTop = x.scrollHeight

                    setTimeout(() => {
                        setIsError(false)
                        setError("")
                    }, 15000);
                }
            })
            .catch(err => console.log(err))
    }

    // function position(element){
    //     let left = 0, top = 0

    //     do{
    //         left += element.offsetLeft - element.scrollLeft
    //         top += element.offsetTop - element.scrollTop
    //     } while(element = element.offsetParent)

    //     return [top, left]
    // }

    const onChange = (e) => {
        // console.log("on form change : ", e.target)
        // const x = document.querySelector(".scroll")
        // let p = position(x)
        // const top = x.scrollTop
        const name = e.target.name
        // setScroll(x.scrollTop)

        updateFormData(e, setFormDataState)
        // document.querySelector(".scroll").scrollTop = top
        focusNext(document.querySelector("form"), name)
    }

    const checkUsernameAvailability = (e) => {
        const username = e.target.value
        // console.log("username changed : ", username, e)
        fetch("http://localhost:8080/user/username-availability", {
            method: "POST",
            body: JSON.stringify({
                username
            })
        })
            .then(res => res.json())
            .then(data => {
                // console.log("username : ", data)
                if (data.error) {
                    setUsernameError(true)
                } else {
                    setUsernameError(false)
                }
                document.querySelector("input[name='username']")?.focus()
            })
            .catch(err => {
                console.log(err)
            })
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
                        <form onSubmit={SignupHandler} onChange={onChange}>
                            {/* <Slider onSubmit={SignupHandler} submitButtonLabel="Sign up"> */}
                            <div>
                                <label for="uid-image"><span>Full Name</span><input name="name" type="text" placeholder="Your name" value={formDataState.name} /></label>
                                <label for="uid-image"><span>Username</span><input name="username" type="text" placeholder="Username" value={formDataState.username} onInput={checkUsernameAvailability} onPaste={checkUsernameAvailability} /></label>
                                {formDataState.username && (usernameError ? (<div className="error">Username is not available</div>) : (<div className="message">Username is available</div>))}
                                <label for="uid-image"><span>Bio</span><textarea name="bio" placeholder="Enter your bio here" value={formDataState.bio}></textarea></label>
                                <label for="uid-image"><span>Password:</span><input name="password" type="password" placeholder="Password" value={formDataState.password} /></label>
                                <label for="uid-image"><span>Email</span><input name="email" type="email" placeholder="Email address" value={formDataState.email} /></label>
                                <label for="uid-image"><span>Phone number</span><input name="phone" type="tel" placeholder="Phone number" value={formDataState.phone} /></label>
                                <label for="uid-image"><span>University</span><input name="university" type="text" placeholder="University" value={formDataState.university} /></label>
                            </div>
                            <div>
                                <label for="uid-image"><span>University ID number</span><input name="uid" type="text" placeholder="University ID number" value={formDataState.uid} /></label>
                                <label for="uid-image"><span>University ID image</span><input name="uid-image" type="file" accept="image/jpg,image/jpeg,image/png" files={formDataState['uid-image']} /></label>
                                <div className="message">It is essential to upload an image of your university ID to verify your details and for future use.</div>
                                <label for="profile-pic"><span>Profile picture</span><input name="profile-pic" type="file" accept="image/jpg,image/jpeg,image/png" files={formDataState['profile-pic']} /></label>
                                <label for="profile-pic"><span>Select tags you are interested in</span>
                                    <TagInputField name="tags" value={formDataState.tags} />
                                </label>
                                <div className=""></div>
                                <div className="check-field"><label className="concent" for="concent">All the details provided above are correct</label><input name="correctDetails" type="checkbox" value={formDataState.correctDetails} checked={formDataState.correctDetails} /></div>
                                <div className="check-field"><label className="concent" for="concent"><span>By continuing, I agree to the </span><span><Link to="/terms-of-services">Terms of Services</Link></span><span>&nbsp;&&nbsp;</span><Link to="/privacy-policy">Privacy Policy</Link></label><input name="concent" type="checkbox" value={formDataState.concent} checked={formDataState.concent} /></div>
                                {isError && (<div className="error">{error}</div>)}
                                <input className="icon-button" type="submit" value="Sign up" />
                            </div>
                            {/* </Slider> */}
                        </form>
                        <div className="message"><span>Already have an account? </span><Link to="/login" label="Click here" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup
    ;