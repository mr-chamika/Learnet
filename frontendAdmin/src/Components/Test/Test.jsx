import { useState } from "../../../react_lite/createDOM";

const Test = () => {

    const [x, setX] = useState(100)



    return ( 
        <div className="test">
            {x}
            <br />
            <button onClick={()=>{setX(prev => prev + 1)}}>nested click</button>
        </div>
     );
}
 
export default Test;
// addComponent("Test", Test)