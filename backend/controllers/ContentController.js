const File = require("../models/FileModel")
const Note = require("../models/NoteModel")

async function getContent(req, res){
    const {contentId, contentType} = req.body
    
    switch(contentType){
        case "file":
            const file = await File.findById(contentId)
            res.json(file)
            break
        case "note":
            const note = await Note.findById(contentId)
            res.json(note)
            break
        default:
            
    }
}

async function getFile(req, res){
    const {fileId} = req.body
    console.log("gat file : ", fileId)
    const userId = req.user.userId

    const file = await File.findById(fileId)
    console.log("file found : ", file)
    if(file){
        const fileSavePath = file.savePath
        res.sendFile(fileSavePath, file.fileType)
    }else{
        res.json({error: "File cannot be found"})
    }
}


module.exports = {
    getContent,
    getFile
}