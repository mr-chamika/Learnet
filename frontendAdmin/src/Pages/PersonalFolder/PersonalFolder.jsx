import { useEffect, useState } from "../../../react_lite/createDOM";
import Link from "../../Router/Link";
import DirectoryIcon from "./DirectoryIcon/DirectoryIcon";
import "./PersonalFolder.css"

const PersonalFolder = ({children}) => {
    
    return ( 
        <div className="personal-folder">
            {/* Personal Folder */}
            {children}
        </div>
    );
}
 
export default PersonalFolder;