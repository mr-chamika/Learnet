//import {useState} from "../../../react_lite/createDOM"
import "./Tabs.css";
import {TabsData} from "./TabsData.jsx";

const Tabs = ({activeTab}) => {

    return (
      <div className="tabs-container">
        <div className="content">
          {TabsData.map((data,i)=> {
            return(
              <div className={`component ${activeTab === i ? "active": ""}`} key={i}>
                {data.component}
              </div>
            )
          })}
        </div>
      </div>
    );
  };
  
  export default Tabs;