import { useState } from "../../../../react_lite/createDOM";
import FolderTree from "./FolderTree";

const FolderTreeContainer = ({ folder, onSelect, expandedFolders, toggleFolderExpansion, isActive}) => {
    
  const getPath = (folder, selectedFolder) => {
    const path = []
    const getPathUtil = (folder, selectedFolder) => {
      if(folder._id === selectedFolder._id){
        path.push(selectedFolder.name)
        return path.join("/")
      }else{
        path.push(folder.name)
        const length = folder.subDirs.length
        for(let i = 0; i < length; i++){
          const x = getPathUtil(folder.subDirs[i], selectedFolder)
          if(x) return x
        }
        path.pop()
        return null
      }
    }

    return getPathUtil(folder, selectedFolder)
  }

    const [pathString, setPathString] = useState("/")
    const onSelectInner = (f) => {
      const ps = getPath(folder, f)
      console.log("path string : ", ps)
      setPathString(ps)
        onSelect(f)
    }

    return ( 
        <div className="folder-tree-container">
            {pathString && (<div className="selected-folder">{pathString}</div>)}
            <FolderTree
              isActive={isActive}
              key={folder._id}
              folder={folder}
              onSelect={onSelectInner}
              expandedFolders={expandedFolders}
              toggleFolderExpansion={toggleFolderExpansion}
            />
        </div>
     );
}
 
export default FolderTreeContainer;