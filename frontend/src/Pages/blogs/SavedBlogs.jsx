import { useEffect, useState } from "../../../../react_lite/createDOM";
import BlogItem from "./BlogItem";
import { useContext } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";

function SavedBlogs({ setBlogs }) {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    
    fetch("http://localhost:8080/blog/saved-blogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSavedBlogs(data.savedBlogs); 
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching saved blogs:", err);
        setError("Failed to fetch saved blogs.");
        setLoading(false);
      });
  }, [user.token]);

  return (
    <div className="blog-list-container">
      {loading && <div className="center-aligned-message">Loading...</div>}
      {!loading && error && (
        <div className="center-aligned-message">Error: {error}</div>
      )}
      {!loading && !error && savedBlogs.length === 0 && (
        <div className="center-aligned-message">No saved blogs found.</div>
      )}
      {!loading &&
        !error &&
        savedBlogs.length > 0 &&
        savedBlogs.map((blog) => (
          <BlogItem
            key={blog._id}
            blog={blog}
            setBlogs={setBlogs}
            isOwner={false} 
          />
        ))}
    </div>
  );
}

export default SavedBlogs;