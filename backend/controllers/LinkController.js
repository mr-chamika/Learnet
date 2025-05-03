const UserDirectory = require("../models/DirectoryModel")
const LinkModel = require("../models/LinkModel")
const { addDataToDirectory } = require("../utils/DirectoryUpdates")

async function getLink(req, res){
    const {linkId} = req.body
    const userId = req.user.userId

    const linkObj = await LinkModel.getLink(userId, linkId)
    if(linkObj){
        res.json(linkObj)
    }else{
        res.json({Error: "Link cannot be found"})
    }
}

async function createLink(req, res){
    const {name, description, link, isPublic, license, dirId} = req.body
    const userId = req.user.userId

    // console.log("create linkObj: ", name, description, link, isPublic, license)
    const dir = await UserDirectory.findDirectory(userId)
    const subDir = dir.findSubDir(dirId)
    const linkObj = await LinkModel.createLink(userId, name, description, link, isPublic, license)
    // console.log("provided dir Id : ", dirId)
    // addDataToDirectory(dirId, dir.hieracy, "linkObj", linkObj._id)
    subDir.addData("link", linkObj._id)
    await dir.save()
    // console.log("linkObj created : ", linkObj)
    if(linkObj){
        res.json(linkObj)
    }else{
        res.json({Error: "Link cannot be created"})
    }
}

async function editLink(req, res){
    const {linkId, name, description, link, visibiility, license} = req.body
    const userId = req.user.userId

    const linkObj = await LinkModel.editLink(userId, linkId, name, description, link, visibiility, license)
    if(linkObj){
        res.json(linkObj)
    }else{
        res.json({Error: "Link cannot be edited"})
    }
}

async function deleteLink(req, res){
    const {linkId} = req.body
    const userId = req.user.userId

    const linkObj = await LinkModel.deleteLink(userId, linkId)
    if(linkObj){
        res.json(linkObj)
    }else{
        res.json({Error: "Link cannot be deleted"})
    }
}


module.exports = {
    getLink,
    createLink,
    editLink,
    deleteLink
};