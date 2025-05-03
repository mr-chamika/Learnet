
import { useEffect,useState, useContext } from '../../../../react_lite/createDOM';
import BlogDataBox from '../../../Components/BlogDataBox/BlogDataBox';
import { UserContext } from '../../../Contexts/UserContext';
import { routerContext } from '../../../Router/Router';


const Blog = () => {
  const { params } = useContext(routerContext);
  const {id} = params
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {user} = useContext(UserContext)

  useEffect(() => {
    fetch(`http://localhost:8080/blog/get`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          authorization: `bearer ${user.token}`,
        },
        body: JSON.stringify({ Id: id }),
    })
        .then((response) => response.json())
        .then((data) => {
          
          if(!data.error){
              setBlog(data); 
              setLoading(false);
            }
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
}, [user, id]);



  if(loading){
    return (
      <div className="center-aligned-message-container">
          <div className="center-aligned-message">Loading...</div>
        </div>
    );
  }

  return (
    <div className="blog-container">
      {loading && (<div>Loading...</div>)}
      {error && (<div>Error: {error}</div>)}
      {!error && !loading && (<BlogDataBox blog={blog} />)}
    </div>
  );
};

export default Blog;
