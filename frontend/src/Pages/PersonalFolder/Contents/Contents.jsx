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
import ContextMenuContainer from "../../../Components/ContextMenu/ContextMenuContainer"
import UploadFilePopup from "../UploadFilePopup/UploadFilePopup"
import VideoPlayer from "../../../Components/VideoPlayer/VideoPlayer"
import { useFiles } from "../../../Contexts/FilesContext"
import RenameFolderPopup from "../RenameFolderPopup/RenameFolderPopup"
import ContentDetails from "../ContentDetails/ContentDetails"
import { findDir } from "../../../Util/DirectoryUtil"
import { formDataToObj } from "../../../Util/FormDataToObj"

const Contents = () => {

    const {user} = useContext(UserContext)
    const {goto} = useContext(routerContext)
    const {folderHieracy: dirHierarcy, setFolderHieracy: setDirHieracy} = useContext(FolderContext)
    console.log("dirHierarcy : ctop", dirHierarcy)
    const [currentDir, setCurrentDir] = useState(dirHierarcy)
    const [dirStack, setDirStack] = useState([])

    useEffect(()=>{
        setCurrentDir(prev=>{
            console.log("current dir gg : ", prev, dirHierarcy)
            let x
            if(prev._id){
                const d = findDir(dirHierarcy, prev._id)
                console.log("directory found : ", d)
                x = d
            }else{
                x = dirHierarcy
            }
            console.log("bbbbbbbbbbbbbb : ", x)
            return x
        })
    }, [dirHierarcy])

    const openFolder = (dir) => {
        setDirStack(prev=>{return [...prev, currentDir]})
        setCurrentDir(dir)
    }

    const [contextMenuDir, setContextMenuDir] = useState(null)
    // const [contextMenuDirType, setContextMenuDirType] = useState(null)
    
    // EXECUTED WHEN CLICKED ON A FOLDER
    // const clickHandler = (dir, e) => {
    //     e.stopPropagation()
    //     if(e.button === 2){
    //         console.log("dir clicked 0")
    //         setMenuVisible(true)
    //     }else if(e.button === 0){
    //         if(menuVisible){
    //             console.log("dir clicked 1")
    //             console.log("menu visible : ", menuVisible)
    //             setMenuVisible(false)
    //         }else{
    //             console.log("contextMenuDir : ", contextMenuDir)
    //             openFolder(dir)
    //             // console.log("dir clicked 2")
    //             // setDirStack(prev=>{return [...prev, currentDir]})
    //             // // console.log("new dir: ", dir)
    //             // setCurrentDir(dir)
    //         }
    //     }
    // }

    // GO BACK TO THE PREVIOUS DIRECTORY
    const backHandler = () => {
        if(dirStack.length){
            const topDir = dirStack.pop()
            const updatedDir = findDir(dirHierarcy, topDir._id)
            setCurrentDir(updatedDir)
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

    // POPUP HANDLERS ================================================================

    const newFolderHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.new-folder"))
    }

    const renameFolderHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.rename-folder"))
    }
    
    const uploadFileHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.upload-file"))
    }

    const createNoteHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.new-note"))
    }
    
    const addVideoHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.new-video"))
    }
    
    const addLinkHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".personal-folder .popup-box.new-link"))
    }

    // ============================================================================

    // DELETE OPERATION ============================================

    // const deleteFolderHandler = (e, selectedDir) => {
    //     console.log("selected dir : ", selectedDir)
    //     e ?. e.stopPropagation()
    //     fetch("http://localhost:8080/dir/", {
    //         method: "PATCH",
    //         headers: {
    //             authorization: `bearer ${user.token}`
    //         },
    //         body: JSON.stringify({
    //             action: "delete-directory",
    //             deleteDirId: selectedDir._id,
    //         })
    //     })        
    //     .then(res=>res.json())
    //     .then(data=>{
    //         console.log("data : ", data)
    //         // setFolderHieracy(data)
    //         setCurrentDir(prev=>{
    //             prev.subDirs = prev.subDirs.filter((dir)=>dir._id !== selectedDir._id)
    //             console.log(prev)
    //             return {...prev}
    //         })
    //     })
    //     .catch(err=>console.log(err))
    // }

    const deleteHandler = (type, content) => {
        fetch("http://localhost:8080/dir/", {
            method: "PATCH",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                action: "delete",
                type,
                contentId: content._id,
                parentDirectoryId: currentDir._id
            })
        })        
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)
            // setFolderHieracy(data)
            // setCurrentDir(prev=>{
            //     prev.subDirs = prev.subDirs.filter((dir)=>dir.name !== selectedDir.name)
            //     console.log(prev)
            //     return {...prev}
            // })
            if(!data.error){
                setDirHieracy(data.hieracy)
            }
        })
        .catch(err=>console.log(err))
    }

    // =============================================================

    // OPEN OPERATION =========================================================

    const openHandler = (e, type, content) => {
        console.log("type : ", type, content)
        switch(type){
            case "dir": {
                openFolder(content)
                break
            }
            case "note": {
                onClickNote(content, e)
                break
            }
            case "file": {
                if(content.fileType === "pdf"){
                    setTimeout(() => {
                        goto(`/user/personal-folder/pdf/${content._id}`)
                    }, 1000);
                }
                break
            }
            case "link": {
                const a = document.createElement("a")   
                a.href = content.link
                a.target = "_blank"
                a.click()
                break
            }
            case "video": {
                const a = document.createElement("a")   
                a.href = content.link
                a.target = "_blank"
                a.click()
                break
            }
            default:
                
        }
    }

    // ========================================================================

    // EDIT OPERATION =========================================================

    const editHandler = (e, type, content) => {
        e.stopPropagation()
        switch(type){
            case "dir": {
                // TODO : 
                renameFolderHandler(e)
                break
            }
            case "note":{
                goto(`/user/personal-folder/note-editor/${content._id}`)
                break
            }
            case "file":{
                
            }
            case "link":{

            }
            case "video":{
                
            }
            default:
        }
    }

    // ========================================================================

    // COPY, MOVE AND PASTE OPERATIONS ========================================

    const [clipboard, setClipboard] = useState(null)

    const moveHandler = (type, content) => {
        setClipboard({type, content, currentParentDir: currentDir, operation: "move"})
    }

    const copyHandler = (type, content) => {
        setClipboard({type, content, currentParentDir: currentDir, operation: "copy"})
    }

    const pasteHandler = (type, newParentDir) => {
        if(type === "dir"){
            fetch("http://localhost:8080/dir/", {
                method: "PATCH",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({
                    action: clipboard.operation,
                    type: clipboard.type,
                    contentId: clipboard.content._id,
                    currentParentDirectoryId: clipboard.currentParentDir._id,
                    newParentDirectoryId: newParentDir._id
                })
            })        
            .then(res=>res.json())
            .then(data=>{
                console.log("data : ", data)
                if(!data.error){
                    setDirHieracy(data.hieracy)
                }
            })
            .catch(err=>console.log(err))
        }else{
            console.warn("Cannot paste : type must be 'dir'")
        }
    }
    // ======================================================================



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


    // FETCHING DATA OF THE CURRENT FOLDER FROM THE BACKEND (NOTES, VIEOS, LINKS)
    const { notes, getNotes, setNotes } = useNotes();
    const [currentDirNotes, setCurrentDirNotes] = useState([]);
    
    const fetchNotes = async () => {
        const notes = await getNotes(currentDir.notes);
        if(notes){
            setCurrentDirNotes(notes);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [currentDir.notes]);

    const { videos, getVideos, setVideos } = useVideos();
    const [currentDirVideos, setCurrentDirVideos] = useState([]);
    
    const fetchVideos = async () => {
        const videos = await getVideos(currentDir.videos);
        if(videos){
            setCurrentDirVideos(videos);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [currentDir.videos]);
    
    const { links, getLinks, setLinks } = useLinks();
    const [currentDirLinks, setCurrentDirLinks] = useState([]);

    const fetchLinks = async () => {
        const links = await getLinks(currentDir.links);
        if(links){
            setCurrentDirLinks(links);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, [currentDir.links]);

    const { files, getFiles } = useFiles();
    const [currentDirFiles, setCurrentDirFiles] = useState([]);

    const fetchFiles = async () => {
        const files = await getFiles(currentDir.files);
        if(files){
            setCurrentDirFiles(files);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [currentDir.files]);

    const [currentDirSubDirs, setCurrentDirSubDirs] = useState([])

    useEffect(()=>{
        setCurrentDirSubDirs(currentDir.subDirs)
    }, [currentDir.subDirs])

    // =============================================================


    // FILTER  =====================================================
    const [currentTab, setCurrentTab] = useState("all")

    const selectTabHandler = (tab) => {
        setCurrentTab(tab)
    }
    // ==============================================================

    // CONTEXT MENU =================================================

    // const menuOptions = [
    //     { label: 'Import', id: 3, onClick: ()=>pasteHandler(contextMenuDir)},
    //     { label: 'Export', id: 3, onClick: ()=>pasteHandler(contextMenuDir)},
    //     { label: 'New Folder', id: 3, onClick: ()=>pasteHandler(contextMenuDir)},
    //     { label: 'Create Note', id: 3, onClick: ()=>pasteHandler(contextMenuDir)},
    //     { label: 'Open', id: 1, onClick: (e)=>openHandler(contextMenuDir.type, contextMenuDir.content, e)},
    //     { label: 'Edit', id: 1, onClick: (e)=>editHandler(contextMenuDir.type, contextMenuDir.content, e)},
    //     // { label: 'Sort By', id: 1, onClick: ()=>openFolder(contextMenuDir)},
    //     { label: 'Delete', id: 2 , color: "red", onClick: ()=>deleteHandler(contextMenuDir.type, contextMenuDir.content)},
    //     { label: 'Cut', id: 3, onClick: ()=>moveHandler(contextMenuDir.type, contextMenuDir.content)},
    //     { label: 'Copy', id: 3, onClick: ()=>copyHandler(contextMenuDir.type, contextMenuDir.content)},
    //     { label: 'Paste', id: 3, onClick: ()=>pasteHandler(contextMenuDir.type, contextMenuDir.content)},
    //   ];

     const contextMenuTypes = {
        item_context: [
            { label: 'Open', id: 1, onClick: (e)=>openHandler(e, contextMenuDir.type, contextMenuDir.content)},
            { label: 'Edit', id: 1, onClick: (e)=>editHandler(e, contextMenuDir.type, contextMenuDir.content)},
            { label: 'Share', id: 1, onClick: (e)=>editHandler(e, contextMenuDir.type, contextMenuDir.content)},
            // { label: 'Sort By', id: 1, onClick: ()=>openFolder(contextMenuDir)},
            { label: 'Delete', id: 2 , color: "red", onClick: ()=>deleteHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Cut', id: 3, onClick: ()=>moveHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Copy', id: 3, onClick: ()=>copyHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Paste', id: 3, onClick: ()=>pasteHandler(contextMenuDir.type, contextMenuDir.content)}
        ],
        area_context: [
            { label: 'Upload File', id: 3, onClick: (e)=>uploadFileHandler(e)},
            // { label: 'Export', id: 3, onClick: ()=>pasteHandler(contextMenuDir)},
            { label: 'New Folder', id: 3, onClick: (e)=>newFolderHandler(e)},
            { label: 'Create Note', id: 3, onClick: (e)=>createNoteHandler(e)},
            { label: 'Add video', id: 3, onClick: (e)=>addVideoHandler(e)},
            { label: 'Add Link', id: 3, onClick: (e)=>addLinkHandler(e)},
            { label: 'Paste', id: 3, onClick: ()=>pasteHandler(contextMenuDir.type, contextMenuDir.content)}
        ],
     }

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    // const handleOptionClick = (option) => {
    //     setMenuVisible(false); // Hide menu after selection
    //     // alert(`Selected ${option.label}`);
    //     switch(option.label){
    //         case "Open":
    //             openFolder(contextMenuDir)
    //             break
    //         case "Delete":
    //             deleteFolderHandler(null, contextMenuDir)
    //             break
    //         default:
    //             alert(`Selected ${option.label}`);
                
    //     }
    // };

    const handleRightClick = (e, type, content) => {
        // content type could be dir, note, video, link,...
        e.stopPropagation()
        if(e.button === 2){
            e.preventDefault(); // Prevent default right-click menu
            console.log("context menu dir : ", content)
            setSelectedContent({type, content})
            setContextMenuDir({type, content})
            // setContextMenuDirType(type)
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setMenuVisible("item_context");
        }
    };

    const handleClickOutside = (e) => {
        setMenuVisible(false); // Hide menu on outside click
    };

    const handleAreaClick = (e) => {
        e.preventDefault(); // Prevent default right-click menu
        setContextMenuDir({type: "dir", content: currentDir})
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible("area_context");
    }

    //==================================================================

    const showNotes = currentTab === "notes" || currentTab === "all"
    const showVideos = currentTab === "videos" || currentTab === "all"
    const showLinks = currentTab === "links" || currentTab === "all"
    const showFiles = currentTab === "files" || currentTab === "all"
    const showDirectories = currentTab === "directories" || currentTab === "all"

    const allText = "all"
    const directoriesText = "directories"
    const notesText = "notes"
    const videosText = "videos"
    const linksText = "links"

    const onClickVideo = (video, e) => {
        goto(`/user/personal-folder/video/${video._id}`)
    }

    const onClickNote = (note, e) => {
        e.stopPropagation()
        goto(`/user/personal-folder/note/${note._id}`)
    }

    // VIDEO STREAMING ========================================

    // const [video, setVideo] = useState("")
    // useEffect(()=>{
    //     console.log("fetching video......................")
    //     fetch("http://localhost:8080/user/video",{
    //         method: "POST"
    //     })
    //     .then(res=>res.blob())
    //     .then(blob=>{
    //         const url = URL.createObjectURL(blob)
    //         console.log("video: ", url)
    //         setVideo(url)
    //     })
    // }, [])

    const videoUrl = "http://localhost:8080/user/video"
    const [mediaSource, setMediaSource] = useState(null);
    const [url, setUrl] = useState("")

    useEffect(() => {
        // Create a MediaSource instance
        const ms = new MediaSource();
        setMediaSource(ms);

        ms.addEventListener("sourceopen", () => {
            const sourceBuffer = ms.addSourceBuffer("video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"");

            let start = 0;
            const chunkSize = 0.001 * 1024 * 1024; // 10 MB chunks

            const fetchChunk = async () => {
                // Fetch the next chunk
                const response = await fetch(videoUrl, {
                    headers: {
                        Range: `bytes=${start}-${start + chunkSize - 1}`,
                    },
                });

                const data = await response.arrayBuffer();
                console.log("video data ===== : ", data)
                sourceBuffer.appendBuffer(data);

                start += chunkSize;

                // If the content length indicates the end, stop fetching
                if (start >= parseInt(response.headers.get("Content-Range").split("/")[1], 10)) {
                    ms.endOfStream();
                }
            };

            sourceBuffer.addEventListener("updateend", () => {
                if (!sourceBuffer.updating && ms.readyState === "open") {
                    fetchChunk();
                }
            });

            // Start fetching the first chunk
            fetchChunk();
        });

        // Attach the MediaSource to the video element
        // if (videoRef.current) {
        //     videoRef.current.src = URL.createObjectURL(ms);
        // }
        setUrl(URL.createObjectURL(ms))

        return () => {
            // Cleanup
            if (ms) {
                // ms.removeEventListener("sourceopen", fetchChunk);
            }
        };
    }, [videoUrl]);

    // =======================================================


    // DETAILS PANNEL ========================================
    const [show, setShow] = useState(true)

    const detailsPannelToggle = (e) => {
        setShow(prev=>!prev)
    }

    // =======================================================

    // SINGLE CLICK ON ITEMS (CONTENT) =======================

    const [selectedContent, setSelectedContent] = useState({})
    const onSingleClick = (e, type, content) =>{
        setSelectedContent({type, content})
    }

    // =======================================================

    // DOUBLE CLICK ON ITEMS (CONTENT) =======================

    const handleDoubleClick = (e, type, content) => {
        e.stopPropagation()
        e.preventDefault();
        openHandler(e, type, content)

    };



    // =======================================================

    // SEARCH ================================================

    const [isSearchActive, setIsSearchActive] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const searchHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)
        if(data.search.trim() !== ""){
            fetch("http://localhost:8080/dir/search", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({
                    search: data.search
                })
            })        
            .then(res=>res.json())
            .then(data=>{
                console.log("file search result : ", data)
                if(!data.error){
                    setIsSearchActive(true)
                    setCurrentDirSubDirs([])
                    setCurrentDirFiles(data.files)
                    setCurrentDirNotes(data.notes)
                    setCurrentDirLinks(data.links)
                    setCurrentDirVideos(data.videos)
                }
            })
            .catch(err=>console.log(err))
        }
    }

    const clearSearchHandler = (e) => {
        e.preventDefault()
        setIsSearchActive(false)
        setSearchValue("")
        setCurrentDirSubDirs(currentDir.subDirs)
        fetchFiles()
        fetchNotes()
        fetchLinks()
        fetchVideos()
    }

    // =======================================================

    console.log("selected content : ", selectedContent)
    return ( 
        <div className="contents bottom-right" onClick={handleClickOutside}>
            <div className="left-pannel" onContextMenu={handleAreaClick}>
                <PopupBox className = "new-note" key="1">
                    <NewNotePopus setCurrentDir={setCurrentDir} currentDir={currentDir}/>
                </PopupBox>
                <PopupBox className = "new-video" key="2">
                    <NewVideoPopup setCurrentDir={setCurrentDir} currentDir={currentDir} setCurrentDirVideos={setCurrentDirVideos}/>
                </PopupBox>
                <PopupBox className = "new-link" key="3">
                    <NewLinkPopus setCurrentDir={setCurrentDir} currentDir={currentDir} setCurrentDirLinks={setCurrentDirLinks}/>
                </PopupBox>
                <PopupBox className = "new-folder" key="4">
                    <NewFolderPopup setCurrentDir={setCurrentDir} currentDir={currentDir}/>
                </PopupBox>
                <PopupBox className = "rename-folder" key="5">
                    <RenameFolderPopup setCurrentDir={setCurrentDir} selectedDir={contextMenuDir} setDirHieracy={setDirHieracy}/>
                </PopupBox>
                <PopupBox className = "upload-file" key="6">
                    <UploadFilePopup setCurrentDir={setCurrentDir} currentDir={currentDir}/>
                </PopupBox>
                <ContextMenuContainer 
                    contextMenuTypes={contextMenuTypes}
                    position={menuPosition}
                    visible={menuVisible}
                    // onOptionClick={handleOptionClick}
                />
                {/* <ContextMenu
                    options={menuOptions}
                    position={menuPosition}
                    visible={menuVisible}
                    onOptionClick={handleOptionClick}
                /> */}
                {/* <ContextMenuArea> */}
                <div className="topbar">
                    <div className="left">
                        <button className="tab-button" onClick={backHandler}>&lt;</button>
                        <button className={currentTab === "all" ? "tab-button active" : "tab-button"} onClick={()=>selectTabHandler(allText)}>All</button>
                        <button className={currentTab === "directories" ? "tab-button active" : "tab-button"} onClick={()=>selectTabHandler(directoriesText)}>Directories</button>
                        <button className={currentTab === "notes" ? "tab-button active" : "tab-button"} onClick={()=>selectTabHandler(notesText)}>Notes</button>
                        <button className={currentTab === "videos" ? "tab-button active" : "tab-button"} onClick={()=>selectTabHandler(videosText)}>Videos</button>
                        <button className={currentTab === "links" ? "tab-button active" : "tab-button"} onClick={()=>selectTabHandler(linksText)}>Links</button>
                    </div>
                    <div className="right">
                        {/* <button className="icon-button" onClick={addVideoHandler}>Add Video</button>
                        <button className="icon-button" onClick={addLinkHandler}>Add Link</button>
                        <button className="icon-button" onClick={createNoteHandler}>Create Note</button>
                        <button className="icon-button" onClick={newFolderHandler}>New Folder</button>
                        <button className="icon-button" onClick={uploadFileHandler}>Upload File</button>
                        {!show && (<button className="icon-button" onClick={detailsPannelToggle}>&lt;show</button>)}
                        {show && (<button className="icon-button" onClick={detailsPannelToggle}>close&gt;</button>)} */}
                        <form onSubmit={searchHandler}>
                            <input type="text" name="search" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} placeholder="Search"/>
                            <input type="submit" />
                            {isSearchActive && (<button className="icon-button" onClick={clearSearchHandler}>Clear</button>)}
                        </form>
                    </div>
                </div>
                <div className="path">
                    {createPath(dirStack)}
                </div>

                {/* <VideoPlayer /> */}

                {/* <video controls={true}>
                    <source src={videoUrl} type="video/mp4" />
                </video> */}
                
                <div className="dir-list-container">
                    <table className="dir-list">
                        <tr><th>Name</th><th>Owner</th><th>Last modified</th></tr>
                        {
                            showDirectories && currentDirSubDirs && currentDirSubDirs.map((dir, i)=>{
                                return (
                                    <DirectoryIcon 
                                        dir={dir}
                                        key={`dir-${i}`}
                                        onSingleClick={onSingleClick}
                                        onDoubleClick={handleDoubleClick}
                                        onContextMenu={handleRightClick}
                                        selectedContent={selectedContent}
                                    />
                                )
                            })
                        }
                        {
                            showNotes && currentDirNotes.map((note, i)=>{
                                return (
                                    <DirectoryIcon
                                        dir={note}
                                        className="note"
                                        key={`notes-${i}`}
                                        onSingleClick={onSingleClick}
                                        onDoubleClick={handleDoubleClick}
                                        onContextMenu={handleRightClick}
                                        selectedContent={selectedContent}
                                    />
                                )
                            })
                        }
                        {
                            showVideos && currentDirVideos.map((video, i)=>{
                                return (
                                    <DirectoryIcon 
                                        dir={video}
                                        className="video"
                                        key={`video-${i}`}
                                        onSingleClick={onSingleClick}
                                        onDoubleClick={handleDoubleClick}
                                        onContextMenu={handleRightClick}
                                        selectedContent={selectedContent}
                                    />
                                )
                            })
                        }
                        {
                            showLinks && currentDirLinks.map((link, i)=>{
                                return (
                                    <DirectoryIcon
                                        dir={link}
                                        className="link"
                                        key={`link-${i}`}
                                        onSingleClick={onSingleClick}
                                        onDoubleClick={handleDoubleClick}
                                        onContextMenu={handleRightClick}
                                        selectedContent={selectedContent}
                                    />
                                )
                            })
                        }
                        {
                            showFiles && currentDirFiles.map((file, i)=>{
                                return (
                                    <DirectoryIcon 
                                        dir={file}
                                        className="file"
                                        key={`file-${i}`}
                                        onSingleClick={onSingleClick}
                                        onDoubleClick={handleDoubleClick}
                                        onContextMenu={handleRightClick}
                                        selectedContent={selectedContent}
                                    />
                                )
                            })
                        }
                    </table>
                </div>
            </div>
            {/* {show && 
            (<div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                <div className="details-pannel-bottom">
                    <div className="name">
                        {selectedContent.name}
                    </div>
                    <div className="description">
                        {selectedContent.description}
                    </div>
                    <div className="owner">
                        {selectedContent.userId}
                    </div>
                    <div className="lisence">
                        {selectedContent.lisence}
                    </div>
                    <div className="visibility">
                        {selectedContent.visibility}
                    </div>
                    <div className="shared-with">
                        {selectedContent.sharedWith}
                    </div>
                    <div className="created-on">
                        {selectedContent.createdOn}
                    </div>
                    <div className="updated-on">
                        {selectedContent.updatedOn}
                    </div>
                </div>
            </div>
            )} */}
            {show && 
            (<div className="details-pannel-container">
                <ContentDetails selectedContent={selectedContent}/>
            </div>
            )}
        </div>
     );
}
 
export default Contents;