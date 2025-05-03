import ContextMenu from "./ContextMenu";

const ContextMenuContainer = ({ contextMenuTypes, contextMenuTitles, position, visible, onOptionClick }) => {

    const types = Object.keys(contextMenuTypes)

    return ( 
        <div className="context-menu-container">
            {
                types.map((type, index)=>{
                    return (
                        <ContextMenu key={index} title={contextMenuTitles ? contextMenuTitles[type] : ""} options={contextMenuTypes[type]} position={position} visible={visible === type} onOptionClick={onOptionClick}/>
                    )
                })
            }
        </div>
     );
}
 
export default ContextMenuContainer;