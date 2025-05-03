import { useContext, useEffect, useState } from "../../../../frontend/react_lite/createDOM";
import Link from "../../../../frontend/src/Router/Link";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { UserContext } from "../../Contexts/UserContext";
import "./Domains.css"

const Domains = () => {

    const {user} = useContext(UserContext)
    const {users} = useContext(otherUsersContext)
    const [searchValue, setSearchValue] = useState("")
    const [domains, setDomains] = useState([])

    const searchHandler = (e) => {
        console.log("user: in search ", user)
        e.preventDefault()

        const formData = new FormData(e.target)

        setUser(user=>{
            console.log("search token : ", user)
            fetch("http://localhost:8080/user/admin/search",{
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: formData
            })
            .then(res=>res.json())
            .then(data=>{
                if(!data.error){
                    console.log("search results : ", data)
                    if(data instanceof Array){
                        setUserDetails(data)
                    }
                }
            })
            .catch(err=>console.log(err))
            return user
        })
    }

    const onChange = (e) => {
        setSearchValue(e.target.value)
        document.querySelector('input[name="search"]').focus()
    }

    useEffect(()=>{
        fetch("http://localhost:8080/domain/get", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setDomains(data)
            }
        })
    }, [user])

    const filteredDomains = domains.filter(v=>{
        if(v.domain.includes(searchValue) ||
            v.university.includes(searchValue) ||
            v.addedBy.username.includes(searchValue))
        {
            return true
        }else{
            return false
        }
    })

    const removeHandler = (id) => {
        fetch("http://localhost:8080/domain/remove", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                domainId: id
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setDomains(prev=>{
                    const updated = prev.filter(v=>v._id != id)
                    return updated
                })
            }
        })
    }
    
    return (
        <div className="users">
            <div className="users-topbar">
                <div className="left">
                    <form onSubmit={searchHandler}>
                        <div className="input-fields">
                            <input type="text" name="search" value={searchValue} placeholder="Search by Domain, University and Admin" onInput={onChange}/>
                            <input type="submit" name="submit" value="Search" />
                        </div>
                    </form>
                </div>
                <div className="right">
                    <Link to="/admin/domains/add" className="icon-button">Add domain</Link>
                </div>
            </div>
            <div className="users-details">
                <div className="header">
                    <div className="header-item">Domain</div>
                    <div className="header-item">University</div>
                    <div className="header-item">CreatedBy</div>
                    <div className="header-item">Remove</div>
                </div>
                {
                    filteredDomains && filteredDomains.map(domain=>{
                        return (
                            <div className="domain-card">
                                <div>{domain.domain}</div>
                                <div>{domain.university}</div>
                                <div>{domain.addedBy.username}</div>
                                <div onClick={()=>removeHandler(domain._id)}>&cross;</div>
                            </div>
                        )
                    })
                }
               {/* {userDetails && userDetails.map(user => {
                    return (
                        <UserCard key={user._id} userData={user} />
                    )
                })} */}
            </div>
            {/* {!searchValue && (
                <div className="load-more-container">
                    <button className="icon-button load-more" onClick={loadMoreHandler}>Load more</button>
                </div>
            )} */}
        </div>
     );
}
 
export default Domains;