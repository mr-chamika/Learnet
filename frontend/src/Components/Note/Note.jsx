import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import { routerContext } from "../../Router/Router";
import "./Note.css"

const Note = () => {

    const {params} = useContext(routerContext)
    const {user} = useContext(UserContext)
    const {noteId} = params

    const [noteData, setNoteData] = useState({})

    useEffect(()=>{
        fetch("http://localhost:8080/note/get", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                noteId,
            })
        })        
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)
            setNoteData(data)
        })
        .catch(err=>console.log(err))
    }, [noteId])

    return (
        <div className="note-viewer">
            <div className="note-name">{noteData.name}</div>
            <div className="note-description">{noteData.description}</div>
            <div className="note-content">{noteData.content}</div>
        </div>
    );

    // return ( 
    //     <div className="note">
    //         <h1><strong>The Universe: An Overview</strong></h1>

    //         <h2><strong>1. What is the Universe?</strong></h2>
    //         <p>The <strong>universe</strong> is all of space and time, along with its contents, including stars, planets, galaxies, and all forms of matter and energy. The scale of the universe is vast, and <strong>understanding it</strong> is one of the biggest challenges in <strong>modern science</strong>.</p>

    //         <h3><strong>Key Points:</strong></h3>
    //         <ul>
    //             <li>The universe is approximately <strong>13.8 billion years</strong> old.</li>
    //             <li>It contains <strong>hundreds of billions of galaxies</strong>.</li>
    //             <li>It is constantly expanding, a process known as <strong>cosmic expansion</strong>.</li>
    //         </ul>

    //         <hr />

    //         <h2><strong>2. The Big Bang Theory</strong></h2>
    //         <p>The <strong>Big Bang Theory</strong> is the leading explanation of how the universe began. It proposes that the universe started as a small, hot, dense point roughly 13.8 billion years ago and has been expanding ever since.</p>

    //         <h3><strong>Important Concepts:</strong></h3>
    //         <ul>
    //             <li><strong>Singularity</strong>: The universe originated from a single point, also known as the singularity.</li>
    //             <li><strong>Cosmic Inflation</strong>: After the Big Bang, the universe expanded rapidly, a process called <em>inflation</em>.</li>
    //         </ul>

    //         <blockquote><em>“In the beginning, there was only chaos. From this chaos emerged the universe as we know it.”</em></blockquote>

    //         <hr />

    //         <h3><strong>3. Composition of the Universe</strong></h3>
    //         <p>The universe is made up of various components:</p>
    //         <ul>
    //             <li><strong>Dark Matter</strong> (<em>27% of the universe</em>): Mysterious and invisible matter that doesn't emit light but exerts gravitational effects.</li>
    //             <li><strong>Dark Energy</strong> (<em>68% of the universe</em>): A force causing the accelerated expansion of the universe.</li>
    //             <li><strong>Normal Matter</strong> (<em>5% of the universe</em>): The matter that makes up stars, planets, and all living things.</li>
    //         </ul>

    //         <hr />

    //         <h2><strong>4. Life in the Universe?</strong></h2>
    //         <p>The question of whether there is life beyond Earth is one of the most profound mysteries in science. <em>Are we alone in the universe?</em></p>

    //         <p>There are trillions of planets in the universe, some of which may have conditions suitable for life. <strong>Exoplanet</strong> research is currently underway to find such planets outside our solar system.</p>

    //         <hr />

    //         <h3><strong>Summary</strong></h3>
    //         <p>In summary, the universe is a vast, dynamic, and mysterious place. As our understanding grows, so do the possibilities of discovering the origins of life and the ultimate fate of the cosmos.</p>

    //     </div>
    //  );
}
 
export default Note;