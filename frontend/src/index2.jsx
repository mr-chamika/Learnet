import createDOM, { useState } from "../react_lite/createDOM";
import tstImg from "./Assets/learnet.png"

const Text = () => {

    const [count, setCount] = useState(10)

    const x = []
    for(let i = 0; i < count; i++){
        x.push(i)
    }

    return ( 
        <div>
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            <span className={`hello-${count}`}>Hello world</span>
            <br />
            {/* <img src={tstImg} /> */}
            {/* {count < 20 && (<div>conditional rendering gone wrong</div>)} */}
            <button onClick={()=>setCount(prev=>prev+1)}>inc</button>
            {x.map(v=>{
                return (
                    <div>{v}</div>
                )
            })}
            {count < 20 ? 
            (<div>less than 20</div>) : 
            (<div className="red">greater than or equal to 20</div>)}
            <div>count : {count}</div>
        </div>
     );
}
 
export default Text;

createDOM(Text, document.getElementById("root"));