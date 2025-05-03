const ChatImage = require("../models/ChatImageModel")
const CommunityDetails = require("../models/CommunityDetails")
const GroupDetails = require("../models/GroupDetails")
const { saveFileAsync, fileTypeFromMagicNumber } = require("../utils/FileUtil")
const path = require("path")

async function getFile(req, res){
    const {fileId} = req.body
    const userId = req.user.userId

    const file = await ChatImage.findById(fileId)
    if(file){
        if(file.visibility === "PUBLIC"){
            const fileSavePath = file.savePath
            res.sendFile(fileSavePath, file.fileType)
        }else{
            if(file.groupId){
                const group = await GroupDetails.findById(file.groupId)
                if(
                    group.members.indexOf(userId) >= 0 ||
                    group.admins.indexOf(userId) >= 0
                ){
                    const fileSavePath = file.savePath
                    res.sendFile(fileSavePath, file.fileType)
                }
            }else if(file.communityId){
                const community = await CommunityDetails.findById(file.communityId)
                if(
                    community.members.indexOf(userId) >= 0 ||
                    community.admins.indexOf(userId) >= 0
                ){
                    const fileSavePath = file.savePath
                    res.sendFile(fileSavePath, file.fileType)
                }
            }else{
                res.json({error: "Unauthorized"})
            }
        }
    }else{
        res.json({Error: "File cannot be found"})
    }
}

// async function getFileMetadata(req, res){
//     const {fileId} = req.body
//     const userId = req.user.userId

//     const file = await FileModel.getFile(userId, fileId)
//     if(file){
//         res.json(file)
//     }else{
//         res.json({Error: "File cannot be found"})
//     }
// }

async function createFile(req, res){
    console.log("files : ", JSON.stringify(req.files))
    const file = req.files["groupImage"] || req.files["communityImage"]
    const userId = req.user.userId

    const fileType = fileTypeFromMagicNumber(file.data)
    if(fileType === "other"){
        res.json({Error: "File type unsupported"})
        return
    }

    const filename = Date.now() + file.filename
    await saveFileAsync({...file, filename: filename}, "./uploads/gcimages")
    const savePath = path.join("./uploads/gcimages", filename)

    const visibiility = "PRIVATE"
    const fileObj = await ChatImage.createFile(userId, fileType, savePath, visibiility)

    if(fileObj){
        res.json({fileId : fileObj._id})
    }else{
        res.json({Error: "File cannot be created"})
    }
}

// async function editFile(req, res){
//     // const {fileId, name, description, content, visibiility, license} = req.body
//     const {fileId, name, ...updates} = req.body
//     const userId = req.user.userId

//     console.log("file id : ", fileId)
//     console.log("userid : ", userId)
//     console.log("updates : ", updates)
//     // const file = await FileModel.editFile(userId, fileId, name, description, content, visibiility, license)
//     const file = await FileModel.editFile(userId, fileId, updates)
//     if(file){
//         res.json(file)
//     }else{
//         res.json({Error: "File cannot be edited"})
//     }
// }

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
    createFile,
    // editFile,
    deleteFile
};