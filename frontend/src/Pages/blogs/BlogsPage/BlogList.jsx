import BlogItem from "./BlogItem";
import {useContext ,useEffect} from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";

function BlogList({ blogs, setBlogs, activeTab, setSavedBlogs }) {

    // const { user } = useContext(UserContext);

    // const userId = user._id;

    // useEffect(()=>{

    //     fetch("http://localhost:8080/blog/saved-blogs",{

    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             authorization: `bearer ${user.token}`,
    //         },
    //         body: JSON.stringify({ userId }),


    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if(data){console.log(data)}else(console.log(data.error))
    //     })
    //     .catch((error)=>console.log(error))

    // },[])

    return (
        <div>
            {blogs.length === 0 && activeTab === "suggestedBlogs" && (<div>No suggestions available in the moment.</div>)}
            {blogs.length === 0 && activeTab === "userBlogs" && (<div>No blogs available. Create one to get started!</div>)}
            {blogs.length === 0 && activeTab === "savedBlogs" && (<div>No saved blogs available.</div>)}
            <div className="blogs-list">
                {blogs && blogs.map((blog, index) => {
                    return (
                        <BlogItem
                            key={index}
                            blog={blog}
                            setBlogs={setBlogs}
                            setSavedBlogs={setSavedBlogs}
                            isOwner={activeTab !== "suggestedBlogs" && activeTab !== "savedBlogs"}
                        />
                    )
                })}
            </div>
        </div>
    );
  }
  
  export default BlogList;
  