import "./ContextMenu.css"

const ContextMenu = ({ options, position, visible, onOptionClick }) => {
  return (
    <div
      className="context-menu"
      style={`top: ${position.y}px; left: ${position.x}px; display: ${visible ? 'block' : 'none'}`}
    >
      {options && options.map((option, index) => {
            return (
                <div
                    key={index}
                    className="menu-item"
                    onClick={() => onOptionClick(option)}
                    style={option.color ? `color: ${option.color};` : ""}
                >
                    {option.label}
                </div>
            )
      })}
    </div>
  );
};

export default ContextMenu;
