import { useContext, useEffect, useState } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import Link from "../../../Router/Link";
import { routerContext } from "../../../Router/Router";
import BlogList from "./BlogList";
import "./MyBlogsPage.css";


function BlogsPage() {
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState({
    suggestedBlogs: true,
    userBlogs: true,
    savedBlogs: false
  });
  const [error, setError] = useState(null);
  const {params} = useContext(routerContext)
  const {at} = params
  const [activeTab, setActiveTab] = useState(at || "suggestedBlogs");

  const {user} = useContext(UserContext)

  useEffect(() => {
    if(user.token){
      setLoading({
        suggestedBlogs: true,
        userBlogs: true,
        savedBlogs: true
      })
      fetch("http://localhost:8080/blog/get-user-blogs", {
        method: "POST",
        headers: { 
          authorization: `bearer ${user.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: "673c247a763762263af973b8" }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data : ", data)
          setUserBlogs(data.blogs || []);
          setLoading(prev=>{
            prev.userBlogs = false
            return {...prev}
          });
        })
        .catch((err) => {
          console.log(err)
          setError(err.message);
          setLoading(false);
        });
  
      fetch("http://localhost:8080/blog/get-relevent", {
        method: "POST",
        headers: { 
          authorization: `bearer ${user.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: "673c247a763762263af973b8" }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(!data.error){
            console.log("data blog : ", data)
            setSuggestedBlogs(data);
            console.log("updating blogs....")
          }
          console.log("set loading false")
          setLoading(prev=>{
            prev.suggestedBlogs = false
            return {...prev}
          });
        })
        .catch((err) => {
          console.log(err)
          setError(err.message);
          setLoading(false);
        });

        fetch("http://localhost:8080/blog/saved-blogs", {
          method: "POST",
          headers: {
            authorization: `bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.error) {
              setSavedBlogs(data.map(v=>{v.isSaved = true; return v}) || []);
            } else {
              setError(data.error);
            }
            setLoading((prev) => {
              prev.savedBlogs = false;
              return { ...prev };
            });
          })
          .catch((err) => {
            console.error(err);
            setError("Failed to fetch saved blogs.");
            setLoading(false);
          });
    }
  }, [user]);

  useEffect(() => {
    if (user.token) {
      if (activeTab === "savedBlogs") {
        
      }
    }
  }, [user]);


  const {goto} = useContext(routerContext)
  let blogList
  let setBlogs
  if(activeTab === "userBlogs"){
    blogList = userBlogs
    setBlogs = setUserBlogs
  }else if(activeTab === "savedBlogs"){
    blogList = savedBlogs
    setBlogs = setSavedBlogs
  }else{
    blogList = suggestedBlogs
    setBlogs = setSuggestedBlogs
  }

  

  return (
    <div className="blogs-page">
      <div className="topbar">
        <div className="left">
          <button
            className={`tab-button ${activeTab === "suggestedBlogs" ? "active" : ""}`}
            onClick={() => setActiveTab("suggestedBlogs")}
          >
            Suggestions
          </button>
          <button
            className={`tab-button ${activeTab === "userBlogs" ? "active" : ""}`}
            onClick={() => setActiveTab("userBlogs")}
          >
            My Blogs
          </button>
          <button
            className={`tab-button ${activeTab === "savedBlogs" ? "active" : ""}`}
            onClick={() => setActiveTab("savedBlogs")}
          >
            Saved Blogs
          </button>
        </div>
        <div className="right">
          <Link className="icon-button" to="/user/blogs/create" label="Create blog"/>
        </div>
      </div>
      
      {loading[activeTab] && (
        <div className="center-aligned-message-container">
          <div className="center-aligned-message">Loading...</div>
        </div>
      )}
      {error && (<div>Error: {error}</div>)}
      {!loading[activeTab] && !error && (
        <div className="blog-list-container">
          <BlogList
            blogs={blogList}
            setBlogs={setBlogs}
            setSavedBlogs={setSavedBlogs}
            activeTab={activeTab}
          />
        </div>
      )}
    </div>
  );
}

export default BlogsPage;
