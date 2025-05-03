import { useContext, useState } from "../../../../frontend/react_lite/createDOM"
import { routerContext } from "../../../../frontend/src/Router/Router"
import { UserContext } from "../../Contexts/UserContext"
import { formDataToObj } from "../../Util/FormDataToObj"
import updateFormData from "../../Util/updateFormData"

const AddDomain = ({socket}) => {

    const [image, setImage] = useState(false)
    const {user} = useContext(UserContext)
    const [error, setError] = useState("")
    const {goto} = useContext(routerContext)
    const [formDataState, setFormDataState] = useState({
        domain: "",
        university: "",
    })

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        const domain = data.domain
        const university = data.university

        fetch("http://localhost:8080/domain/add",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: formData
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                goto("/admin/domains")
            }else{
                setError(data.error)
                setTimeout(()=>{
                    setError("")
                }, 5000)
            }
        })

    }

    const onChange = (e) =>{
        updateFormData(e, setFormDataState)
    }

    return ( 
        <div className="add-domain">
            <div className="section">
                <div className="heading">
                    Add new domain
                </div>
                <form onSubmit={submitHandler} onChange={onChange}>
                    <div className="items-container">
                        <dl className="item">
                            <dt className="title">
                                <label for="">Domain</label>
                            </dt>
                            <dd className="input">
                                <input type="text" name="domain" value={formDataState.domain} />
                                <div className="message">Ex: ucsc.cmb.ac.lk</div>
                            </dd>
                        </dl>
                        <dl className="item">
                            <dt className="title">
                                <label for="">University</label>
                            </dt>
                            <dd className="input">
                                <input type="text" name="university" value={formDataState.university} />
                                <div className="message">Ex: University of Colombo</div>
                            </dd>
                        </dl>
                        {error && (<div className="error">{error}</div>)}
                        <button className="icon-button">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default AddDomain;