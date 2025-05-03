import { useEffect, useState } from "../../../react_lite/createDOM";
import Test from "../../Components/Test/Test";
import "./Forum.css"

const Forum = () => {

    const [x, setX] = useState(100)
    const [y, setY] = useState(200)

    useEffect(()=>{
        console.log("useEffect x, y : ", x, y)
    }, [x, y])

    const isError = true

    return ( 
        <div className="forum">
            Forum
            {x}
            {y}
            <button onClick={()=>setX(prev=>prev+1)}>click</button>
            <button onClick={()=>setY(1000)}>click</button>
            <Test />
            {isError && (<div className="erorr">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, facere ipsa. Molestias nostrum harum dolore provident ullam atque sed, voluptates sequi consequatur dignissimos odit vel repellat officia, iure vero id!</div>)}
        </div>
     );
}
 
export default Forum;