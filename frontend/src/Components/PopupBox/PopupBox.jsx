import "./PopupBox.css"

export const openPopup = (ref) => {
    if(ref && (ref instanceof Node || ref instanceof Element)){
        ref.style.display = "block"
        setTimeout(() => {
            ref.style.opacity = "1"
        }, 1);
        ref.querySelector(".content").classList.remove("hidden")
    }
}

const PopupBox = ({children, className, show, bgClickHandler}) => {

    const backgroundClickHandler = (e) => {
        if(bgClickHandler){
            bgClickHandler(e)
        }else{
            if(e.target.classList.contains("popup-box")){
    
                const contentDiv = e.target.querySelector(".content")
    
                e.target.style.opacity = "0"
                contentDiv.classList.add("hidden")
                setTimeout(() => {
                    e.target.style.display = "none"
                }, 250);
            }
        }
    }

    console.log("showing popup 2")

    return ( 
        <div className={`popup-box ${className ? className : ""}`} onClick={backgroundClickHandler} style={show ? `opacity: 1; display: block;` : `opacity: 0; display: none;`}>
            <div className="content" onClick={e=>e.stopPropagation()}>
                {children}
            </div>
        </div>
     );
}
 
export default PopupBox;