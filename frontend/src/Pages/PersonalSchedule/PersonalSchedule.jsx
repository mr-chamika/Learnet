import "./PersonalSchedule.css"
//import { useState } from "../../../react_lite/createDOM";
import Tabs from "../../Components/Tabs/Tabs.jsx";
import { useState } from "../../../react_lite/createDOM.js";
import { TabsData } from "../../Components/Tabs/TabsData.jsx";

function PersonalSchedule ()  {

	//State to track the active tab
	const [activeTab, setActiveTab] = useState(0);
	
	//Event handler to set the active tab when a tab is clicked
	const handleClick = (id) =>{
		setActiveTab(id);
	};
    
	const tabs = ["Calendar", "Events", "Tasks"]

    return ( 
		<div className="personal-schedule">
			<div className="topbar">
				<div className="left">
					{tabs.map((tab, i) =>{
						return(
							<div className={ `tab-button ${activeTab===i ? "active" : ""}`} key={i}  onClick={()=> {handleClick(i)}}>
								{tab}
							</div>
						)
					})}
				</div>
			</div>
			<Tabs activeTab={activeTab}/>
		</div>
     );
    
}
 
export default PersonalSchedule;