const UserDirectory = require("../models/DirectoryModel")
const NoteModel = require("../models/NoteModel")
const { addDataToDirectory } = require("../utils/DirectoryUpdates")

async function getNote(req, res){
    const {noteId} = req.body
    const userId = req.user.userId

    const note = await NoteModel.getNote(userId, noteId)
    if(note){
        res.json(note)
    }else{
        res.json({Error: "Note cannot be found"})
    }
}

async function createNote(req, res){
    const {name, description, content, visibility, license, sharedWith, dirId} = req.body
    const userId = req.user.userId

    // console.log("create note: ", name, description, content, isPublic, license)
    const dir = await UserDirectory.findDirectory(userId)
    const subDir = dir.findSubDir(dirId)
    // createNote: async function (userId, name, description, content, visibility = "PRIVATE", license = "NONE", sharedWith = []) {
    const note = await NoteModel.createNote(userId, name, description, content, visibility, license, sharedWith)
    // console.log("provided dir Id : ", dirId)
    // addDataToDirectory(dirId, dir.hieracy, "note", note._id)
    subDir.addData("note", note._id)
    await dir.save()
    // console.log("note created : ", note)
    if(note){
        res.json({note, hieracy: dir.hieracy})
    }else{
        res.json({Error: "Note cannot be created"})
    }
}

async function editNote(req, res){
    // const {noteId, name, description, content, visibiility, license} = req.body
    const {noteId, name, ...updates} = req.body
    const userId = req.user.userId

    console.log("note id : ", noteId)
    console.log("userid : ", userId)
    console.log("updates : ", updates)
    // const note = await NoteModel.editNote(userId, noteId, name, description, content, visibiility, license)
    const note = await NoteModel.editNote(userId, noteId, updates)
    if(note){
        res.json(note)
    }else{
        res.json({Error: "Note cannot be edited"})
    }
}

async function deleteNote(req, res){
    const {noteId} = req.body
    const userId = req.user.userId

    const note = await NoteModel.deleteNote(userId, noteId)
    if(note){
        res.json(note)
    }else{
        res.json({Error: "Note cannot be deleted"})
    }
}


module.exports = {
    getNote,
    createNote,
    editNote,
    deleteNote
};