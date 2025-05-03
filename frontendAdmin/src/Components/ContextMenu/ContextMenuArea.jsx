import { useState } from '../../../react_lite/createDOM';
import ContextMenu from './ContextMenu';

const ContextMenuArea = ({children}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const menuOptions = [
    { label: 'Action 1', id: 1 },
    { label: 'Action 2', id: 2 },
    { label: 'Action 3', id: 3 },
  ];

  const handleRightClick = (e) => {
    if(e.button === 2){
        e.preventDefault(); // Prevent default right-click menu
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible(true);
    }
  };

  const handleClickOutside = (e) => {
    setMenuVisible(false); // Hide menu on outside click
  };

  const handleOptionClick = (option) => {
    setMenuVisible(false); // Hide menu after selection
    alert(`Selected ${option.label}`);
  };

  return (
    <div
      className="context-menu-area"
      onContextMenu={handleRightClick}
      onClick={handleClickOutside}
    //   style={`width: 100%; height:300px; border:1px solid #ddd;`}
    >
      {/* <p>Right-click in this area to open the custom context menu.</p> */}
      {children}
      <ContextMenu
        options={menuOptions}
        position={menuPosition}
        visible={menuVisible}
        onOptionClick={handleOptionClick}
      />
    </div>
  );
};

export default ContextMenuArea;
