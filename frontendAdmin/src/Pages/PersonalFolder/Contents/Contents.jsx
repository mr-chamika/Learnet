import { useContext, useEffect, useState } from "../../../../react_lite/createDOM"
import ContextMenu from "../../../Components/ContextMenu/ContextMenu"
import ContextMenuArea from "../../../Components/ContextMenu/ContextMenuArea"
import PopupBox, { openPopup } from "../../../Components/PopupBox/PopupBox"
import { FolderContentContext } from "../../../Contexts/FolderContentContext"
import { FolderContext } from "../../../Contexts/FolderContext"
import { useNotes } from "../../../Contexts/NotesContext"
import { useVideos } from "../../../Contexts/VideosContext"
import { useLinks } from "../../../Contexts/LinksContext"
import { UserContext } from "../../../Contexts/UserContext"
import Link from "../../../Router/Link"
import DirectoryIcon from "../DirectoryIcon/DirectoryIcon"
import NewLinkPopus from "../NewLinkPopup/NewLinkPopup"
import NewNotePopus from "../NewNotePopup/NewNotePopup"
import NewVideoPopup from "../NewVideoPopup/NewVideoPopup"

import "./Contents.css"
import { routerContext } from "../../../Router/Router"
import NewFolderPopup from "../NewFolderPopup/NewFolderPopup"

const Contents = () => {

    const {user} = useContext(UserContext)
    const {goto} = useContext(routerContext)
    const {folderHieracy: dirHierarcy} = useContext(FolderContext)
    // console.log("dir hieracy : ", dirHierarcy)
    // const dirHierarcy = {
    //     name: "/",
    //     createdOn: "2024-01-02 01:25",
    //     // notes: ["n_1", "n_2"],
    //     // videos: ["v_1", "v_2"],
    //     notes: [],
    //     videos: [],
    //     links: [],
    //     subDirs: [
    //         {
    //             name: "Mathematics",
    //             createdOn: "2024-01-02 01:25",
    //             notes: [],
    //             // videos: ["v_3", "v_4"],
    //             // links: ["l_1", "l_2"],
    //             videos: [],
    //             links: [],
    //             subDirs: [
    //                 {
    //                     name: "Discrete Mathematics",
    //                     createdOn: "2024-01-02 01:26",
    //                     notes: ["n_3"],
    //                     videos: ["v_1", "v_3"],
    //                     links: ["l_3", "l_4", "l_5"],
    //                     subDirs: []
    //                 },
    //                 {
    //                     name: "Calculus",
    //                     createdOn: "2024-01-02 01:27",
    //                     notes: ["n_4", "n_5", "n_6"],
    //                     videos: ["v_5", "v_6", "v_7"],
    //                     links: [],
    //                     subDirs: []
    //                 },
    //                 {
    //                     name: "Linear Algebra",
    //                     createdOn: "2024-01-02 01:28",
    //                     notes: [],
    //                     videos: ["v_8"],
    //                     links: ["l_5", "l_6", "l_7"],
    //                     subDirs: []
    //                 },
    //             ]
    //         },
    //         {
    //             name: "Science",
    //             createdOn: "2024-01-20 05:23",
    //             // notes: ["n_1"],
    //             // videos: ["v_9"],
    //             // links: ["l_8", "l_9"],
    //             notes: [],
    //             videos: [],
    //             links: [],
    //             subDirs: []
    //         },
    //         {
    //             name: "IT",
    //             createdOn: "2024-05-10 21:10",
    //             notes: [],
    //             // videos: ["v_1", "v_2"],
    //             // links: ["l_10"],
    //             videos: [],
    //             links: [],
    //             subDirs: []
    //         },
    //     ]
    // }

    // const notes = {
    //     "n_1" : {
    //         name: "Note 1",
    //         shortDescription: "note description note description note description"
    //     },
    //     "n_2" : {
    //         name: "Note 2",
    //         shortDescription: "note description note description note description"
    //     },
    //     "n_3" : {
    //         name: "Note 3",
    //         shortDescription: "note description note description note description"
    //     },
    //     "n_4" : {
    //         name: "Note 4",
    //         shortDescription: "note description note description note description"
    //     },
    //     "n_5" : {
    //         name: "Note 5",
    //         shortDescription: "note description note description note description"
    //     },
    //     "n_6" : {
    //         name: "Note 6",
    //         shortDescription: "note description note description note description"
    //     },
    // }

    // const videos = {
    //     "v_1" : {
    //         name: "video 1",
    //         link: "https://www.youtube.com/embed/Ze38kD1ZNfo?si=tSg9__QteFWqd8B2"
    //     },
    //     "v_2" : {
    //         name: "video 2",
    //         link: "https://www.youtube.com/embed/Ze38kD1ZNfo?si=TakuF5otuFiKNC_9"
    //     },
    //     "v_3" : {
    //         name: "video 3",
    //         link: "https://www.youtube.com/watch?v=eIbyBmLko8Q"
    //     },
    //     "v_4" : {
    //         name: "video 4",
    //         link: "https://www.youtube.com/watch?v=Ze38kD1ZNfo"
    //     },
    //     "v_5" : {
    //         name: "video 5",
    //         link: "https://www.youtube.com"
    //     },
    //     "v_6" : {
    //         name: "video 6",
    //         link: "https://www.youtube.com"
    //     },
    //     "v_7" : {
    //         name: "video 7",
    //         link: "https://www.youtube.com"
    //     },
    //     "v_8" : {
    //         name: "video 8",
    //         link: "https://www.youtube.com"
    //     },
    //     "v_9" : {
    //         name: "video 9",
    //         link: "https://www.youtube.com"
    //     },
    //     "v_10" : {
    //         name: "video 10",
    //         link: "https://www.youtube.com"
    //     },
    // }
    // const links = {
    //     "l_1" : {
    //         name: "Link 1",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_2" : {
    //         name: "Link 2",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_3" : {
    //         name: "Link 3",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_4" : {
    //         name: "Link 4",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_5" : {
    //         name: "Link 5",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_6" : {
    //         name: "Link 6",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_7" : {
    //         name: "Link 7",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_8" : {
    //         name: "Link 8",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_9" : {
    //         name: "Link 9",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    //     "l_10" : {
    //         name: "Link 10",
    //         link: "https://ugvle.ucsc.cmb.ac.lk"
    //     },
    // }

    // const currentDir = dirHierarcy
    const [currentDir, setCurrentDir] = useState(dirHierarcy)
    const [dirStack, setDirStack] = useState([])

    // function setCurrentDirAdvanced(dir){
    //     const add = [
    //         {
    //             name: "Videos",
    //             createdOn: "",
    //             subDirs: [],
    //             notes: [],
    //             links: [],
    //             videos: ["v_4", "v_5", "v_1"],
    //             additionsMade: true
    //         },
    //         {
    //             name: "Links",
    //             createdOn: "",
    //             subDirs: [],
    //             notes: [],
    //             links: ["l_4", "l_5", "l_1"],
    //             videos: [],
    //             additionsMade: true
    //         },
    //         {
    //             name: "Notes",
    //             createdOn: "",
    //             subDirs: [],
    //             notes: ["n_6", "n_2", "n_1"],
    //             links: [],
    //             videos: [],
    //             additionsMade: true
    //         }
    //     ]
    //     if(typeof dir === "function"){
    //         setCurrentDir(prev=>{
    //             const d = dir(prev)
    //             if(!d.additionsMade){
    //                 d.subDirs = [...d.subDirs, ...add]
    //                 d.additionsMade = true
    //             }
    //             return d
    //         })
    //     }else{
    //         if(!dir.additionsMade){
    //             dir.subDirs = [...dir.subDirs, ...add]
    //             dir.additionsMade = true
    //         }
    //         setCurrentDir(dir)
    //     }
    // }

    useEffect(()=>{
        setCurrentDir(dirHierarcy)
    }, [dirHierarcy])
    
    useEffect(()=>{
        // console.log(currentDir)
        // console.log(dirStack)
    }, [currentDir, dirStack])

    const openFolder = (dir) => {
        // console.log("dir clicked 2")
        setDirStack(prev=>{return [...prev, currentDir]})
        // console.log("new dir: ", dir)
        setCurrentDir(dir)
    }

    const [contextMenuDir, setContextMenuDir] = useState(null)
    const [contextMenuDirType, setContextMenuDirType] = useState(null)
    
    const clickHandler = (dir, e) => {
        e.stopPropagation()
        if(e.button === 2){
            console.log("dir clicked 0")
            setMenuVisible(true)
        }else if(e.button === 0){
            if(menuVisible){
                console.log("dir clicked 1")
                console.log("menu visible : ", menuVisible)
                setMenuVisible(false)
            }else{
                console.log("contextMenuDir : ", contextMenuDir)
                openFolder(dir)
                // console.log("dir clicked 2")
                // setDirStack(prev=>{return [...prev, currentDir]})
                // // console.log("new dir: ", dir)
                // setCurrentDir(dir)
            }
        }
    }

    const backHandler = () => {
        if(dirStack.length){
            setCurrentDir(dirStack.pop())
            setDirStack(prev =>{
                prev.pop()
                return [...prev]
            })
        }
    }

    const createPath = (stack) => {
        // console.log("stack : ", stack)
        let path = ""
        for(let dir of stack){
            // console.log("dir : ", dir)
            path += dir.name
            if(path.at(-1) !== "/"){
                path += "/"
            }
        }

        if(path.at(-1) !== "/"){
            path += "/"
        }

        if(currentDir.name !== "/"){
            path += currentDir.name
        }

        return path
    }

    const newFolderHandler = () => {
        openPopup(document.querySelector(".personal-folder .popup-box.new-folder"))
    }

    const deleteFolderHandler = (e, selectedDir) => {
        console.log("selected dir : ", selectedDir)
        e ?. e.stopPropagation()
        fetch("http://localhost:8080/dir/", {
            method: "PATCH",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                action: "delete-directory",
                deleteDirId: selectedDir._id,
            })
        })        
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)
            // setFolderHieracy(data)
            setCurrentDir(prev=>{
                prev.subDirs = prev.subDirs.filter((dir)=>dir.name !== selectedDir.name)
                console.log(prev)
                return {...prev}
            })
        })
        .catch(err=>console.log(err))
    }

    const createNoteHandler = () => {
        openPopup(document.querySelector(".personal-folder .popup-box.new-note"))
    }

    const addVideoHandler = () => {
        openPopup(document.querySelector(".personal-folder .popup-box.new-video"))
    }

    const addLinkHandler = () => {
        openPopup(document.querySelector(".personal-folder .popup-box.new-link"))
    }

    // const {findItem} = useContext(FolderContentContext)
    // const [currentDirNotes, setCurrentDirNotes] = useState([])
    // useEffect(()=>{
    //     async function fetch(){
    //         const len = currentDir.notes.length
    //         console.log("fetching notes : ", len)
    //         const notes = []
    //         for(let i = 0; i < len; i++){
    //             // console.log("i: ", i)
    //             const note = await findItem("note", currentDir.notes[i])
    //             // notes.push(note)
    //         }
    //         // setCurrentDirNotes(notes)
    //     }

    //     fetch()
    // }, [currentDir])

    const { notes, getNotes, setNotes } = useNotes();
    const [currentDirNotes, setCurrentDirNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await getNotes(currentDir.notes);
            if(notes){
                setCurrentDirNotes(notes);
            }
        };

        fetchNotes();
    }, [currentDir.notes]);

    const { videos, getVideos, setVideos } = useVideos();
    const [currentDirVideos, setCurrentDirVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const videos = await getVideos(currentDir.videos);
            if(videos){
                setCurrentDirVideos(videos);
            }
        };

        fetchVideos();
    }, [currentDir.videos]);
    
    const { links, getLinks, setLinks } = useLinks();
    const [currentDirLinks, setCurrentDirLinks] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const links = await getLinks(currentDir.links);
            if(links){
                setCurrentDirLinks(links);
            }
        };

        fetchLinks();
    }, [currentDir.links]);

    const [currentTab, setCurrentTab] = useState("all")

    const selectTabHandler = (tab) => {
        setCurrentTab(tab)
    }

    const menuOptions = [
        { label: 'Open', id: 1 },
        { label: 'Delete', id: 2 , color: "red"},
        { label: 'Cut', id: 3 },
        { label: 'Copy', id: 3 },
        { label: 'Paste', id: 3 },
      ];
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const handleOptionClick = (option) => {
        setMenuVisible(false); // Hide menu after selection
        // alert(`Selected ${option.label}`);
        switch(option.label){
            case "Open":
                openFolder(contextMenuDir)
                break
            case "Delete":
                deleteFolderHandler(null, contextMenuDir)
                break
            default:
                alert(`Selected ${option.label}`);
                
        }
    };

    const handleRightClick = (dir, e, type) => {
        if(e.button === 2){
            e.preventDefault(); // Prevent default right-click menu
            setContextMenuDir(dir)
            setContextMenuDirType(type)
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setMenuVisible(true);
        }
    };

    const handleClickOutside = (e) => {
        setMenuVisible(false); // Hide menu on outside click
    };

    const showNotes = currentTab === "notes" || currentTab === "all"
    const showVideos = currentTab === "videos" || currentTab === "all"
    const showLinks = currentTab === "links" || currentTab === "all"
    const showDirectories = currentTab === "directories" || currentTab === "all"

    const allText = "all"
    const directoriesText = "directories"
    const notesText = "notes"
    const videosText = "videos"
    const linksText = "links"

    // console.log("dir : ", currentDir.subDirs)
    //   console.log("notes : ", currentDirNotes)

      const [dirItems, setDirItems] = useState([])

    // useEffect(()=>{
    //     setDirItems([...currentDir.subDirs, ...currentDirNotes])
    // }, [currentDir.subDirs, currentDirNotes])

    const onClickVideo = (video, e) => {
        goto(`/user/personal-folder/video/${video._id}`)
    }

    const onClickNote = (note, e) => {
        goto(`user/personal-folder/note/${note._id}`)
    }

    return ( 
        <div className="contents bottom-right" onClick={handleClickOutside}>
            <PopupBox className = "new-note">
                <NewNotePopus setCurrentDir={setCurrentDir} currentDir={currentDir}/>
            </PopupBox>
            <PopupBox className = "new-video">
                <NewVideoPopup setCurrentDir={setCurrentDir} currentDir={currentDir} setCurrentDirVideos={setCurrentDirVideos}/>
            </PopupBox>
            <PopupBox className = "new-link">
                <NewLinkPopus setCurrentDir={setCurrentDir} currentDir={currentDir} setCurrentDirLinks={setCurrentDirLinks}/>
            </PopupBox>
            <PopupBox className = "new-folder">
                <NewFolderPopup setCurrentDir={setCurrentDir} currentDir={currentDir}/>
            </PopupBox>
            <ContextMenu
                options={menuOptions}
                position={menuPosition}
                visible={menuVisible}
                onOptionClick={handleOptionClick}
            />
            {/* <ContextMenuArea> */}
                {/* <ContextMenuArea> */}
                <div className="topbar">
                    <div className="left">
                        <button className="icon-button" onClick={backHandler}>&lt;</button>
                        <button className={currentTab === "all" ? "icon-button active" : "icon-button"} onClick={()=>selectTabHandler(allText)}>All</button>
                        <button className={currentTab === "directories" ? "icon-button active" : "icon-button"} onClick={()=>selectTabHandler(directoriesText)}>Directories</button>
                        <button className={currentTab === "notes" ? "icon-button active" : "icon-button"} onClick={()=>selectTabHandler(notesText)}>Notes</button>
                        <button className={currentTab === "videos" ? "icon-button active" : "icon-button"} onClick={()=>selectTabHandler(videosText)}>Videos</button>
                        <button className={currentTab === "links" ? "icon-button active" : "icon-button"} onClick={()=>selectTabHandler(linksText)}>Links</button>
                    </div>
                    <div className="right">
                        {/* <Link className="icon-button" to="/" label="New folder" /> */}
                        <button className="icon-button" onClick={addVideoHandler}>Add Video</button>
                        <button className="icon-button" onClick={addLinkHandler}>Add Link</button>
                        {/* <Link className="icon-button" to="/user/personal-folder/create-note" label="create-note" /> */}
                        <button className="icon-button" onClick={createNoteHandler}>Create Note</button>
                        <button className="icon-button" onClick={newFolderHandler}>New Folder</button>
                    </div>
                </div>
                <div className="path">
                    {/* /Mathematics/Discrete Mathematics/Number Theory */}
                    {createPath(dirStack)}
                </div>
                <div className="dir-list-container">
                <table className="dir-list">
                <tr><th>Name</th><th>Owner</th><th>Last modified</th></tr>
                {/* <div className="body"> */}
                    
                    {/* { showDirectories && (<tr><th>Name</th><th>Created on</th><th>delete</th><th>rename</th></tr>)} */}
                    {
                        showDirectories && currentDir.subDirs.map((dir, i)=>{
                            return (
                                <DirectoryIcon dir={dir} onClick={clickHandler} deleteHandler={deleteFolderHandler} key={`dir-${i}`} onContextMenu={handleRightClick}/>
                            )
                        })
                    }
                    
                    {/* <DirectoryIcon dir={{name: "Videos", createdOn: "", notes: [], videos: [], links: [], subDirs: []}} onClick={()=>selectTabHandler("videos")}/>
                    <DirectoryIcon dir={{name: "Links", createdOn: "", notes: [], videos: [], links: [], subDirs: []}} onClick={()=>selectTabHandler("links")}/>
                    <DirectoryIcon dir={{name: "Notes", createdOn: "", notes: [], videos: [], links: [], subDirs: []}} onClick={()=>selectTabHandler("notes")}/> */}
                {/* </div> */}
                {/* <div className="body notes"> */}
                    {/* <table> */}
                        {/* { showNotes && (<tr><th>Title</th><th>Description</th></tr>)} */}
                        {
                            showNotes && currentDirNotes.map((note, i)=>{
                                return (
                                    <DirectoryIcon dir={note} className="note" key={`notes-${i}`} onClick={onClickNote} onContextMenu={handleRightClick}>
                                            {/* <tr className="note dir">
                                                <td>
                                                    <Link to="/user/personal-folder/note">
                                                        {note.name}
                                                    </Link>
                                                </td>
                                                <td>{note.description}</td>
                                            </tr> */}
                                    </DirectoryIcon>
                                )
                            })
                        }
                    {/* </table> */}
                {/* </div> */}
                {/* <div className=" body videos"> */}
                    {
                        showVideos && currentDirVideos.map((video, i)=>{
                            return (
                                <DirectoryIcon dir={video} className="video" key={`video-${i}`} onClick={onClickVideo} onContextMenu={handleRightClick}>
                                    {/* <Link className="video dir" to="/user/personal-folder/video" data={videos[videoId].link} label={videos[videoId].name}>
                                        <span>{videos[videoId].name}</span> */}
                                        {/* <iframe 
                                            width="560"
                                            height="315"
                                            src={videos[videoId].link}
                                            title="YouTube video player"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerpolicy="strict-origin-when-cross-origin"
                                        >
                                        </iframe> */}
                                    {/* </Link> */}
                                </DirectoryIcon>
                            )
                        })
                    }
                {/* </div> */}
                {/* <div className="body links"> */}
                    {
                        showLinks && currentDirLinks.map((link, i)=>{
                            return (
                                <DirectoryIcon dir={link} className="link" key={`link-${i}`} onContextMenu={handleRightClick}>
                                    {/* <a className="link dir" href="" target="_blank"> */}
                                        {/* <a className="link dir" href={links[linkId].link} target="_blank"> */}
                                        {/* link-{linkId} */}
                                        {/* <a href={links[linkId].link} target="_blank">click here to view</a> */}
                                    {/* </a> */}
                                </DirectoryIcon>
                            )
                        })
                    }
                {/* </div> */}
                </table>
                </div>
                {/* <ContextMenu
                    options={menuOptions}
                    position={menuPosition}
                    visible={menuVisible}
                    onOptionClick={handleOptionClick}
                /> */}
            {/* </ ContextMenuArea> */}
        </div>
     );
}
 
export default Contents;