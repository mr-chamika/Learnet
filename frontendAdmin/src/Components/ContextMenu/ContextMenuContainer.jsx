import ContextMenu from "./ContextMenu";

const ContextMenuContainer = ({ contextMenuTypes, position, visible, onOptionClick }) => {

    const types = Object.keys(contextMenuTypes)

    return ( 
        <div className="context-menu-container">
            {
                types.map((type, index)=>{
                    return (
                        <ContextMenu key={index} options={contextMenuTypes[type]} position={position} visible={visible === type} onOptionClick={onOptionClick}/>
                    )
                })
            }
        </div>
     );
}
 
export default ContextMenuContainer;