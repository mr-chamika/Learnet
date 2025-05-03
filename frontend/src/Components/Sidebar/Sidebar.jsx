import Link from "../../Router/Link";
import "./Sidebar.css"
import icon from "../../Assets/home.svg"
import collapseIcon from "../../Assets/icons/collapse.svg"
import homeIcon from "../../Assets/home.svg"
import chatIcon from "../../Assets/icons/chat.svg"
import folderIcon from "../../Assets/icons/folder.svg"
import scheduleIcon from "../../Assets/icons/schedule.svg"
import forumIcon from "../../Assets/icons/forum.svg"
import blogIcon from "../../Assets/icons/copywriting.png"
import logoutIcon from "../../Assets/icons/logout.svg"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "../../../react_lite/createDOM";
import { themeContext } from "../../Contexts/ThemeContext";

const Sidebar = () => {

    const {isSidebarCollapsed} = useContext(themeContext)
    // console.log("is sidebar collapsed : ", isSidebarCollapsed)

    const collapseHandler = () => {
        document.querySelector(".sidebar").classList.toggle("collapsed")
        const isc = localStorage.getItem("sidebar-collapsed")
        if(isc === "true") localStorage.setItem("sidebar-collapsed", "false")
        else if(isc === "false") localStorage.setItem("sidebar-collapsed", "true")
    }

    // const animHandler = () => {
    //     const anim = document.querySelector('.sidebar li span').animate([
    //         { transform: 'rotate(0) translate3D(-50%, -50%, 0)', color: '#000' },
    //         { color: '#431236', offset: 0.3 },
    //         { transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000' }
    //       ], {
    //         duration: 3000,
    //         iterations: 5
    //       }
    //     );
        
    //     setTimeout(() => {
    //         anim.finish()
    //     }, 5000);
    // }

    useLayoutEffect((element)=>{
        // console.log("_______________ element : ", isSidebarCollapsed, element)
        // if(isSidebarCollapsed){
        if(localStorage.getItem("sidebar-collapsed") === "true"){
            element.classList.add("collapsed")
        }
    })

    const path = window.location.href;

    useLayoutEffect((element)=>{
        const links = element.querySelectorAll(".link a")
        const length = links.length
        for(let i = 0; i < length; i++){
            if(links[i].href == path){
                links[i].classList.add("active")
                break
            }
        }
    })

    return ( 
        <div className="sidebar">
            <div>
                <ul>
                    <li className="link"><button onClick={collapseHandler}><div className="icon"><img fill="white" src={collapseIcon} alt="" /></div><span className="col"><span> Collapse</span></span></button></li>
                    <li className="link"><Link key={2} to="/user" ><div className="icon"><img fill="white" src={homeIcon} alt="" /></div><span className="col"><span> Home</span></span></Link></li>
                    <li className="link"><Link key={3} to="/user/chat" ><div className="icon"><img fill="white" src={chatIcon} alt="" /></div><span className="col"><span> Chat</span></span></Link></li>
                    <li className="link"><Link key={4} to="/user/personal-folder" ><div className="icon"><img fill="white" src={folderIcon} alt="" /></div><span className="col"><span> Personal Folder</span></span></Link></li>
                    <li className="link"><Link key={5} to="/user/personal-schedule" label="" ><div className="icon"><img fill="white" src={scheduleIcon} alt="" /></div><span className="col"><span> Personal Schedule</span></span></Link></li>
                    <li className="link"><Link key={6} to="/user/forum" ><div className="icon"><img fill="white" src={forumIcon} alt="" /></div><span className="col"><span> Forum</span></span></Link></li>
                    <li className="link"><Link key={7} to="/user/blogs" ><div className="icon"><img fill="white" src={blogIcon} alt="" /></div><span className="col"><span> Blogs</span></span></Link></li>
                </ul>
            </div>
            <div>
                <ul>
                    <li className="link"><Link key={6} to="/logout" ><div className="icon"><img fill="white" src={logoutIcon} alt="" /></div><span className="col"><span>Log out</span></span></Link></li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;