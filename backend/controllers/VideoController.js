const UserDirectory = require("../models/DirectoryModel")
const VideoModel = require("../models/VideoModel")
const { addDataToDirectory } = require("../utils/DirectoryUpdates")

async function getVideo(req, res){
    const {videoId} = req.body
    const userId = req.user.userId

    const video = await VideoModel.getVideo(userId, videoId)
    if(video){
        res.json(video)
    }else{
        res.json({Error: "Video cannot be found"})
    }
}

async function createVideo(req, res){
    const {name, description, link, isPublic, license, dirId} = req.body
    const userId = req.user.userId

    // console.log("create video: ", name, description, link, isPublic, license)
    const dir = await UserDirectory.findDirectory(userId)
    const subDir = dir.findSubDir(dirId)
    const video = await VideoModel.createVideo(userId, name, description, link, isPublic, license)
    // console.log("provided dir Id : ", dirId)
    // addDataToDirectory(dirId, dir.hieracy, "video", video._id)
    subDir.addData("video", video._id)
    await dir.save()
    // console.log("video created : ", video)
    if(video){
        res.json(video)
    }else{
        res.json({Error: "Video cannot be created"})
    }
}

async function editVideo(req, res){
    const {videoId, name, description, link, visibiility, license} = req.body
    const userId = req.user.userId

    const video = await VideoModel.editVideo(userId, videoId, name, description, link, visibiility, license)
    if(video){
        res.json(video)
    }else{
        res.json({Error: "Video cannot be edited"})
    }
}

async function deleteVideo(req, res){
    const {videoId} = req.body
    const userId = req.user.userId

    const video = await VideoModel.deleteVideo(userId, videoId)
    if(video){
        res.json(video)
    }else{
        res.json({Error: "Video cannot be deleted"})
    }
}


module.exports = {
    getVideo,
    createVideo,
    editVideo,
    deleteVideo
};