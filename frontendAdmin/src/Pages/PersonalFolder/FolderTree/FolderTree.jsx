import { useState } from "../../../../react_lite/createDOM";

function FolderTree({ folder, onSelect, expandedFolders, toggleFolderExpansion }) {
    // Check if the folder is expanded using the expandedFolders map
    const isExpanded = expandedFolders[folder._id] || false;
  
    // Toggle the expansion of subfolders
    const onClickHandler = () => {
      onSelect(folder);
      toggleFolderExpansion(folder._id); // Toggle the folder expansion state based on folder ID
    };
  
    const x = isExpanded ? "[-]" : "[+]";
  
    return (
      <div style={`margin-left: 20px;`}>
        <div
          onClick={onClickHandler}
          style={`cursor: pointer; color: blue; font-weight: bold; display: flex; align-items: center;`}
        >
          {folder.subDirs && folder.subDirs.length > 0 && (
            <span style={`margin-right: 10px`}>{x}</span>
          )}
          {folder.name}
        </div>
  
        {/* Conditionally render subfolders if expanded */}
        {isExpanded && folder.subDirs && folder.subDirs.map((subFolder) => {
          return (
            <FolderTree
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