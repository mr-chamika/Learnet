import "./DirectoryIcon.css"
import noteIcon from "../../../Assets/icons/PersonalFolder/note.png"
import videoIcon from "../../../Assets/icons/PersonalFolder/video.png"
import linkIcon from "../../../Assets/icons/PersonalFolder/Link.png"
import folderIcon from "../../../Assets/icons/PersonalFolder/Folder.png"
import fileIcon from "../../../Assets/icons/PersonalFolder/file.png"
import { useEffect, useState } from "../../../../react_lite/createDOM"
import { getDate, getTimeDate } from "../../../Util/TimeDate"

const DirectoryIcon = ({dir, onDoubleClick, className="dir", onContextMenu, onSingleClick, selectedContent}) => {

    function formatDate(mongooseDate) {
        if (!mongooseDate) return "Invalid date";
    
        const date = new Date(mongooseDate);
    
        // Check if the input is a valid date
        if (isNaN(date.getTime())) return "Invalid date";
    
        // Extract the components of the date
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    
        // Convert the date to a human-readable string
        return date.toLocaleString('en-US', options); 
    }

    const [date, setDate] = useState("")

    useEffect(()=>{
        const t = getTimeDate(dir.createdOn, "HH-MM")[1]
        const d = getDate(dir.createdOn)
        setDate(`${d} at ${t}`)
    }, [dir])
    
    // Example usage
    // const mongooseDate = "2024-10-25T18:56:55.125Z";
    // console.log(formatDate(mongooseDate)); // "October 25, 2024, 6:56:55 PM UTC"
    const icon = className === "note" ? noteIcon : 
    className === "video" ? videoIcon :
    className === "dir" ? folderIcon : 
    className === "link" ? linkIcon : fileIcon

    const isSelected = selectedContent.content && selectedContent.content._id === dir._id ? "selected" : ""

    return ( 
        <tr className={`dir-item ${className} ${isSelected}`} onClick={(e)=>onSingleClick(e, className, dir)} onDblClick={(e)=>onDoubleClick(e, className, dir)} onContextMenu={(e)=>onContextMenu(e, className, dir)}>
            <td><img className="icon" src={icon} /><div>{dir.name}</div></td>
            <td>me</td>
            <td>{date}</td>
            {/* <td>{formatDate(dir.updatedOn)}</td> */}
            {/* <td>{dir.subDirs.length}</td> */}
            {/* <td onClick={(e)=>deleteHandler(e, dir)}>Delete</td> */}
        </tr>
     );
}
 
export default DirectoryIcon;