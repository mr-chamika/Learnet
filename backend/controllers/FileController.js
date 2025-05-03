const UserDirectory = require("../models/DirectoryModel")
const FileModel = require("../models/FileModel")
const { addDataToDirectory } = require("../utils/DirectoryUpdates")
const { saveFileAsync, fileTypeFromMagicNumber } = require("../utils/FileUtil")
const path = require("path")

async function getFile(req, res){
    const {fileId} = req.body
    const userId = req.user.userId

    const file = await FileModel.getFile(userId, fileId)
    if(file){
        const fileSavePath = file.savePath
        res.sendFile(fileSavePath, file.fileType)
    }else{
        res.json({Error: "File cannot be found"})
    }
}

async function getFileMetadata(req, res){
    const {fileId} = req.body
    const userId = req.user.userId

    const file = await FileModel.getFile(userId, fileId)
    if(file){
        res.json(file)
    }else{
        res.json({Error: "File cannot be found"})
    }
}

async function getPublicFilesMetaOfUser(req, res){
    const userId = req.body.userId
    console.log("userId : ", userId)
    const filesMeta = await FileModel.getPublicFiles(userId)
    res.json(filesMeta)
}

async function createFile(req, res){
    const {name, author, authorName, description, visibility, license, sharedWith, dirId, tags} = req.body
    const {file} = req.files
    const userId = req.user.userId

    console.log("data : ", name, userId)

    // console.log("create file: ", name, description, content, isPublic, license)
    const dir = await UserDirectory.findDirectory(userId)
    const subDir = dir.findSubDir(dirId)

    const fileType = fileTypeFromMagicNumber(file.data)
    if(fileType === "other"){
        res.json({Error: "File type unsupported"})
        return
    }

    const filename = Date.now() + file.filename
    await saveFileAsync({...file, filename: filename}, "./uploads/files")
    const savePath = path.join("./uploads/files", filename)

    // createFile: async function (userId, name, description, content, visibility = "PRIVATE", license = "NONE", sharedWith = []) {
    const fileObj = await FileModel.createFile(userId, name, description, savePath, fileType, visibility, license, sharedWith, tags, author, authorName)
    // console.log("provided dir Id : ", dirId)
    // addDataToDirectory(dirId, dir.hieracy, "file", file._id)
    subDir.addData("file", fileObj._id)
    await dir.save()
    // console.log("file created : ", file)
    delete fileObj.savePath
    if(fileObj){
        res.json({file: fileObj, hieracy: dir.hieracy})
    }else{
        res.json({Error: "File cannot be created"})
    }
}

async function createChatFile(req, res){ // Files shared in a chat(private / group)
    // const {name, author, authorName, description, visibility, license, sharedWith, dirId, tags} = req.body
    const {chatType, groupId} = req.body
    let files = req.files["attachments"]
    console.log("files0 : ", files)
    if(!(files instanceof Array)){
       files = [files] 
    }
    const userId = req.user.userId

    // console.log("files : ", files.attachments.length)
    console.log("files2 : ", files, chatType)

    for(let i = 0; i < files.length; i++){
        const file = files[i]
        const fileType = fileTypeFromMagicNumber(file.data)
        file.fileType = fileType
        if(fileType === "other"){
            res.json({Error: "File type unsupported"})
            return
        }
    }

    const fileObjIds = []
    for(let i = 0; i < files.length; i++){
        const file = files[i]
        const filename = Date.now() + file.filename
        await saveFileAsync({...file, filename: filename}, "./uploads/files")
        const savePath = path.join("./uploads/files", filename)
    
        const fileObj = await FileModel.createFile(userId, file.filename, "File shared in a chat", savePath, file.fileType, chatType, "NONE", [], null, "ME", "")
        fileObjIds.push(fileObj._id)
    }
    res.json({fileIds: fileObjIds})
}

async function editFile(req, res){
    // const {fileId, name, description, content, visibiility, license} = req.body
    const {fileId, name, ...updates} = req.body
    const userId = req.user.userId

    console.log("file id : ", fileId)
    console.log("userid : ", userId)
    console.log("updates : ", updates)
    // const file = await FileModel.editFile(userId, fileId, name, description, content, visibiility, license)
    const file = await FileModel.editFile(userId, fileId, updates)
    if(file){
        res.json(file)
    }else{
        res.json({Error: "File cannot be edited"})
    }
}

async function deleteFile(req, res){
    const {fileId} = req.body
    const userId = req.user.userId

    const file = await FileModel.deleteFile(userId, fileId)
    if(file){
        res.json(file)
    }else{
        res.json({Error: "File cannot be deleted"})
    }
}


module.exports = {
    getFile,
    getFileMetadata,
    getPublicFilesMetaOfUser,
    createFile,
    createChatFile,
    editFile,
    deleteFile
};