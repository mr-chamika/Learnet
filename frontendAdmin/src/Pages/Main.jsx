import Sidebar from "../Components/Sidebar/Sidebar";
import Topbar from "../Components/Topbar/Topbar";

const Main = ({children}) => {

    // const {user} = useContext(UserContext)
    // const {goto} = useContext(routerContext)

    // useEffect(()=>{
    //     if(!user.token) goto("/login")
    // }, [])

    return ( 
        <div className="main cont">
            <div className="box">
                <Topbar />
                <div className="bottom">
                    {children}
                    <Sidebar />
                </div>
            </div>
        </div>
     );
}
 
export default Main;