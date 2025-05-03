import Link from "../../../../frontend/src/Router/Link";
import "./Sidebar.css"
import icon from "../../Assets/home.svg"
import collapseIcon from "../../Assets/icons/collapse.svg"
import dashboardIcon from "../../Assets/icons/dashboard.png"
import usersIcon from "../../Assets/icons/users.png"
import resourcesIcon from "../../Assets/icons/resources.png"
import scheduleIcon from "../../Assets/icons/schedule.svg"
import forumIcon from "../../Assets/icons/forum.svg"
import logoutIcon from "../../Assets/icons/logout.svg"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "../../../../frontend/react_lite/createDOM";
import { themeContext } from "../../Contexts/ThemeContext";

const Sidebar = () => {

    const {isSidebarCollapsed} = useContext(themeContext)

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
                    <li className="link"><button onClick={collapseHandler}><div className="icon"><img src={collapseIcon} alt="" /></div><span className="col"><span> Collapse</span></span></button></li>
                    <li className="link"><Link key={2} to="/admin" ><div className="icon"><img src={dashboardIcon} alt="" /></div><span className="col"><span> Dashboard</span></span></Link></li>
                    <li className="link"><Link key={3} to="/admin/users" ><div className="icon"><img src={usersIcon} alt="" /></div><span className="col"><span>Users</span></span></Link></li>
                    <li className="link"><Link key={4} to="/admin/reports" ><div className="icon"><img src={resourcesIcon} alt="" /></div><span className="col"><span>Reports</span></span></Link></li>
                    <li className="link"><Link key={5} to="/admin/domains" label="" ><div className="icon"><img src={scheduleIcon} alt="" /></div><span className="col"><span>Domains</span></span></Link></li>
                    <li className="link"><Link key={5} to="/admin/analytics" label="" ><div className="icon"><img src={scheduleIcon} alt="" /></div><span className="col"><span>Analytics</span></span></Link></li>
                </ul>
            </div>
            <div>
                <ul>
                    <li className="link"><Link key={6} to="/logout" ><div className="icon"><img src={logoutIcon} alt="" /></div><span className="col"><span>Log out</span></span></Link></li>
                </ul>
            </div>
        </div>
     );
}
 
export default Sidebar;