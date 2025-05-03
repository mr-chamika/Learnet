import "./ContextMenu.css"

const ContextMenu = ({ options, position, visible, onOptionClick, title}) => {
	
	const recalculatePosition = (position, axis="x") => {
		const rect = document.querySelector(".context-menu")?.getBoundingClientRect()
		console.log('rect: ', rect, position)

		if(!rect){
			return position[axis]
		}

		if(axis === "x"){
			if(position.x - rect.width > 0){
				return position.x
			}else{
				return position.x - rect.width
			}
		}else{
			if(position.y - rect.width > 0){
				return position.y
			}else{
				return position.y - rect.width
			}
		}
	}

	// TODO : Fix the context menu overflow issue when click on somewhere around an edge of the window.

  return (
    <div
      className="context-menu"
      style={`top: ${position.y}px; left: ${position.x}px; display: ${visible ? 'block' : 'none'}`}
    >
		{title && (<div className="title">{title}</div>)}
      	{options && options.map((option, index) => {
            return (
                <div
                    key={index}
                    className="menu-item"
                    onClick={option.onClick}
                    style={option.color ? `color: ${option.color};` : ""}
                  // onClick={() => onOptionClick(option)}
                    >
                    {option.label}
                </div>
            )
      })}
    </div>
  );
};

export default ContextMenu;
