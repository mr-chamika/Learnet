import { createContext, useContext, useEffect, useReducer } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

export const FolderContentContext = createContext({})

const FolderContentContextProvider = ({children}) => {

    const reducer = (state, action) => {
        switch(action.type){
            case "add":
                return [...state, action.payload]
                break
            case "addItems":
                return [...state, ...action.payload]
                break
            case "replace":
                const index = state.findIndex(p=>p._id !== action.payload.id)
                state[index] = action.payload.item
                return [...state]
            default:
                return state
        }
    }

    const [notes, notesDispatch] = useReducer(reducer, [])
    const [videos, videoDispatch] = useReducer(reducer, [])
    const [links, linkDispatch] = useReducer(reducer, [])
    const {user} = useContext(UserContext)

    async function fetchItem(type, id){
        const endpoints = {
            note: "http://localhost:8080/note/get",
        }

        const idType = {
            "note": "noteId",
            "video": "videoId",
            "link": "linkId"
        }

        const item = fetch(endpoints[type], {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({[idType[type]]: id})
        })
        .then(res=>res.json())
        .then(data=>{
            if(data && data._id){
                return data
            }
            return null
        })
        .catch(err=>{
            console.log(err)
            return null
        })
    }

    async function findItem(type, id){
        let item = null
        switch(type){
            case "note":
                item = notes.find(n=>n._id === id)
                break
            case "video":
                item = videos.find(v=>v._id === id)
                break
            case "link":
                item = links.find(l=>l._id === id)
                break
            default:
                throw Error("Provided type cannot be found")
        }

        console.log("item : ", item)
        if(!item){
            item = await fetchItem(type, id)
        }

        return item
    }

    function addItem(type, item){
        switch(type){
            case "note":
                notesDispatch({type: "add", payload: item})
            case "video":
                videoDispatch({type: "add", payload: item})
            case "link":
                linkDispatch({type: "add", payload: item})
            default:
                throw Error("Provided type cannot be found")
        }
    }

    function replaceItem(type, id, item){
        switch(type){
            case "note":
                notesDispatch({type: "replace", payload: {id, item}})
            case "video":
                videoDispatch({type: "replace", payload: {id, item}})
            case "link":
                linkDispatch({type: "replace", payload: {id, item}})
            default:
                throw Error("Provided type cannot be found")
        }
    }

    return ( 
        <FolderContentContext.Provider value={{fetchItem, findItem, replaceItem}}>
            {children}
        </FolderContentContext.Provider>
     );
}
 
export default FolderContentContextProvider;