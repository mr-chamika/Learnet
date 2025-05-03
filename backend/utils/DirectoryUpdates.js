// Recursive function to find and update the subdirectory
const findDirectory = (subDirs, directoryId, cb, parentDir = null) => {
    console.log(subDirs)
    for (const subDir of subDirs) {
        console.log("subdir id : ", subDir._id)
        console.log("dir id : ", directoryId)
        if (subDir._id.toString() === directoryId) {
            if(typeof cb === "function") cb(subDir, parentDir)
            return subDir;
        }
        if (subDir.subDirs && subDir.subDirs.length > 0) {
            const dir = findDirectory(subDir.subDirs, directoryId, cb, subDir);
            if(dir) return dir
        }
    }
    return null;
};

const createSubDirectory = (parentDirId, newDirName, hieracy) => {
    const updated = findDirectory([hieracy], parentDirId, (parentDir)=>{
        if(parentDir.subDirs.find(dir=>dir.name === newDirName)){
            throw Error("sub directory already exist.")
        }

        parentDir.subDirs.push({
            name: newDirName,
            notes: [],
            videos: [],
            links: [],
            file: [],
            subDirs: []
        })
    })

    if(!updated){
        throw Error("Parent directory does not found")
    }


    // const parentDirectory = findDirectory([hieracy], parentDirId)
    // const subDirs = parentDirectory.subDirs
    // for(const dir of subDirs){
    //     if(dir.name === newDirName){
    //         throw Error("sub directory already exist.")
    //     }
    // }
    // subDirs.push({
    //     name: newDirName,
    //     notes: [],
    //     videos: [],
    //     links: [],
    //     subDirs: []
    // })
}

const deleteSubDirectory = (parentDirId, deleteDirId, hieracy) => {
    const updated = findDirectory(hieracy.subDirs, deleteDirId, ( deleteDir, parentDir)=>{
        parentDir.subDirs = parentDir.subDirs.filter((dir)=> dir._id !== deleteDir._id)
    }, hieracy)
    
    if(!updated){
        throw Error("sub directory to be deleted does not found")
    }
}

const renameSubDirectory = (directoryId, hieracy, newName) => {
    const updated = findDirectory(hieracy.subDirs, directoryId, (dir)=>{
        dir.name = newName
        console.log("dir : ", dir)
    }, hieracy)
    
    if(!updated){
        throw Error("Directory need to be renamed does not found")
    }
}

const moveSubDirectory = (directoryId, hieracy, currentParentId, newParentId) => {
    findDirectory([hieracy], currentParentId, (dir)=>{
        // removing the folder/directory from the current parent directory
        const index = dir.subDirs.findIndex(dir=>dir._id.equals(directoryId))
        // console.log("move dir : ", index, dir)
        const removedDirectory = dir.subDirs.splice(index, 1)[0] // splice function returns the removed elements as an array
        // addding the folder/directory to the new parent directory
        findDirectory([hieracy], newParentId, (dir)=>{
            dir.subDirs.push(removedDirectory)
        })
    })
}

const copyHierachy = (hieracy) => {
    const subDirsCopy = hieracy.subDirs.map(dir=>copyHierachy(dir))
    const notesCopy = hieracy.notes // TODO : create new documents copying existing ones
    const videosCopy = hieracy.videos
    const linksCopy = hieracy.links

    const dir = {
        name: hieracy.name,
        notes: notesCopy,
        videos: videosCopy,
        links: linksCopy,
        subDirs: subDirsCopy
    }

    return dir
}

const copySubDirectory = (directoryId, hieracy, currentParentId, newParentId) => {
    findDirectory([hieracy], currentParentId, (dir)=>{
        // removing the folder/directory from the current parent directory
        const index = dir.subDirs.findIndex(dir=>dir._id.equals(directoryId))
        const childDir = dir.subDirs[index]
        // console.log('cur parent : ', dir)
        console.log("child dir : ", childDir)
        // addding the folder/directory to the new parent directory
        findDirectory([hieracy], newParentId, (dir)=>{
            // console.log("adding childDir : ", dir, childDir)
            console.log("child dir : ", JSON.stringify(childDir))
            const childDirCopy = copyHierachy(childDir)
            dir.subDirs.push(childDirCopy) // instead of adding a reference of the child directory a deep copy of the child directory should be created and it should be pushed to the directory
        })
    })
}

const pushIfNotAlreadyExist = (array, data) => {
    if(array.indexOf(data) < 0) array.push(data)
    else throw Error("Item already exist in the directory")
}

const addDataToDirectory = (directoryId, hieracy, typeOfData, data) => {

    // TODO : Need to check if there is a note/video/link associated with the provided ref

    const updated = findDirectory([hieracy], directoryId, (dir)=>{
        switch(typeOfData){
            case "note":
                pushIfNotAlreadyExist(dir.notes, data)
                break
            case "video":
                pushIfNotAlreadyExist(dir.videos, data)
                break
            case "link":
                pushIfNotAlreadyExist(dir.links, data)
                break
        }
    })

    if(!updated){
        throw Error("Directory does not found")
    }
}

const removeIfExist = (array, data) => {
    if(array.indexOf(data) >= 0) return array.filter((ref) => ref.toString() !== data)
    throw Error("Item can not be found in the directory")
}

const removeDataFromDirectory = (directoryId, hieracy, typeOfData, data) => {
    const updated = findDirectory([hieracy], directoryId, (dir)=>{
        switch(typeOfData){
            case "note":
                dir.notes = removeIfExist(dir.notes, data)
                break
            case "video":
                dir.videos = removeIfExist(dir.videos, data)
                break
            case "link":
                dir.links = removeIfExist(dir.links, data)
                break
            case "file":
                dir.files = removeIfExist(dir.files, data)
                break
        }
    })

    if(!updated){
        throw Error("Directory does not found")
    }
}

const moveDataFromDirectory = (type, contentId, hieracy, currentParentId, newParentId) => {
    const updated = findDirectory([hieracy], currentParentId, (dir)=>{
        switch(type){
            case "note":
                console.log("dir notes : ", dir.notes)
                dir.notes = removeIfExist(dir.notes, contentId)
                console.log("dir notes 2 : ", dir.notes)
                break
            case "video":
                dir.videos = removeIfExist(dir.videos, contentId)
                break
            case "link":
                dir.links = removeIfExist(dir.links, contentId)
                break
            case "file":
                dir.files = removeIfExist(dir.files, contentId)
                break
        }

        findDirectory([hieracy], newParentId, (dir)=>{
            switch(type){
                case "note":
                    console.log("dir notes 3 : ", dir.notes)
                    pushIfNotAlreadyExist(dir.notes, contentId)
                    console.log("dir notes 4 : ", dir.notes)
                    break
                case "video":
                    pushIfNotAlreadyExist(dir.videos, contentId)
                    break
                case "link":
                    pushIfNotAlreadyExist(dir.links, contentId)
                    break
                case "file":
                    pushIfNotAlreadyExist(dir.files, contentId)
                    break
            }
        })
    })

    if(!updated){
        throw Error("Directory does not found")
    }
}

const copyDataFromDirectory = (type, contentId, hieracy, currentParentId, newParentId) => {
    const updated = findDirectory([hieracy], currentParentId, (dir)=>{
        switch(type){
            case "note":
                // find the document make a copy
                break
            case "video":
                // find the document make a copy
                break
            case "link":
                // find the document make a copy
                break
            case "file":
                // find the document make a copy
                break
        }

        findDirectory([hieracy], newParentId, (dir)=>{
            switch(type){
                case "note":
                    // push the copy to the new parent dir
                    dir.notes = pushIfNotAlreadyExist(dir.notes, contentId)
                    break
                case "video":
                    // push the copy to the new parent dir
                    dir.videos = pushIfNotAlreadyExist(dir.videos, contentId)
                    break
                case "link":
                    // push the copy to the new parent dir
                    dir.links = pushIfNotAlreadyExist(dir.links, contentId)
                    break
                case "file":
                    // push the copy to the new parent dir
                    dir.files = pushIfNotAlreadyExist(dir.files, contentId)
                    break
            }
        })
    })

    if(!updated){
        throw Error("Directory does not found")
    }
}

module.exports = {
    findDirectory,
    createSubDirectory,
    deleteSubDirectory,
    renameSubDirectory,
    moveSubDirectory,
    copySubDirectory,
    addDataToDirectory,
    removeDataFromDirectory,
    moveDataFromDirectory,
    copyDataFromDirectory
}