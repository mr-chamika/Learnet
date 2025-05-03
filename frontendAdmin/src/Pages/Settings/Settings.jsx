import { useState } from "../../../react_lite/createDOM";
import "./Settings.css"

const Settings = ({children}) => {

    console.log(children)

    const [x, setX] = useState(100)

    return ( 
        <div className="settings">
            Settings
            {x}
            <button onClick={()=>setX(prev=>prev+1)}>click</button>
            {children}
        </div>
     );
}
 
export default Settings;