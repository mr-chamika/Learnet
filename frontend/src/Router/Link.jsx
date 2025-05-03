import { useContext } from "../../react_lite/createDOM"
import { routerContext } from "./Router"

const Link = ({to, label, className, children}) => {

    const {goto} = useContext(routerContext)
    if(!goto || typeof goto !== "function"){
        throw Error("Router context cannot be found. Link can be used after the router has initialized or within the components descending the router")
    }
    
    const onClickHandler = (e) => {
        e.preventDefault()
        goto(to)
    }

    const te = "TEXT_ELEMENT"

    return ( 
        <a className={className ? className : ""} onClick={onClickHandler} href={to}>
            {!children && {type: te, props: {}, children: label}}
            {children && children}
        </a>
     );
}
 
export default Link;