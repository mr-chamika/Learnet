import { useState } from "../../../../react_lite/createDOM";
import "./FolderTree.css"
import folderIcon from "../../../Assets/icons/PersonalFolder/Folder.png"

function FolderTree({ folder, onSelect, expandedFolders, toggleFolderExpansion, isActive}) {
    // Check if the folder is expanded using the expandedFolders map
    const isExpanded = expandedFolders[folder._id] || false;
  
    // Toggle the expansion of subfolders
    const onClickHandler = () => {
      if(isActive){
        toggleFolderExpansion(folder._id); // Toggle the folder expansion state based on folder ID
      }
    };

    const selectHandler = (e) => {
      e.stopPropagation()
      onSelect(folder)
    }
  
    const x = isExpanded ? "-" : "+";
  
    return (
      <div className={`folder-tree ${!isActive ? "disabled" : ""}`}>
        <div className="folder-data" onClick={onClickHandler}>
            <span className="sub-dir-count">{x}</span>
            <div onClick={selectHandler} className="folder-icon-name">
              <img className="folder-icon" src={folderIcon} alt="folder"/>
              {folder.name}
            </div>
        </div>
  
        {/* Conditionally render subfolders if expanded */}
        {isExpanded && folder.subDirs && folder.subDirs.map((subFolder) => {
          return (
            <FolderTree
              isActive={isActive}
              key={subFolder._id}
              folder={subFolder}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              toggleFolderExpansion={toggleFolderExpansion}
            />
          )
        })}
      </div>
    );
  }

export default FolderTree


// {folder.subDirs && folder.subDirs.length > 0 && (
//   <span className="sub-dir-count">{x}</span>
// )}
