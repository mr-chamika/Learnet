const UserDirectory = require('../models/DirectoryModel'); // Path to your Directory model
const mongoose = require("mongoose");
const { createSubDirectory, deleteSubDirectory, renameSubDirectory, addDataToDirectory, removeDataFromDirectory, moveSubDirectory, copySubDirectory, moveDataFromDirectory, copyDataFromDirectory } = require('../utils/DirectoryUpdates');
const File = require('../models/FileModel');
const { strToObjId } = require('../utils/strToObjId');
const Note = require('../models/NoteModel');
const Link = require('../models/LinkModel');

// Create a new directory
async function createDirectory(req, res) {
    const userId = new mongoose.Types.ObjectId(String(req.user.userId));
    // const { name, notes, videos, links, subDirs } = req.body;  // got an error : TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined.
    // TODO : change the body parset to return an empty object if no data has been found

    try {
        const alreadyExist = await UserDirectory.findOne({userId})
        if(alreadyExist){
            console.log("################# already exist : ", alreadyExist)
            res.json("Directory already exist")
            return
        }

        const newDirectory = new UserDirectory({
            userId,
            hieracy: {
                name: "/",
                notes: [],
                videos: [],
                links: [],
                subDirs: []
            }
        });

        const savedDirectory = await newDirectory.save();
        // res.status(201).json(savedDirectory); // got the error: res.status() is not a function
        res.json(savedDirectory);
    } catch (error) {
        console.error("Error creating directory: ", error);
        // res.status(500).json({ error: "Failed to create directory." });
        res.json({ error: "Failed to create directory." });
    }
}

// Edit an existing directory
// async function editDirectory(req, res) {
//     const userId = req.user.userId;
//     // const { dirId } = req.params; // Directory ID to edit
//     const {dirId, updateData} = req.body;
//     console.log("dir id : ", dirId)
//     console.log("updateData : ", updateData)

//     try {
//         const directory = await UserDirectory.findOneAndUpdate(
//             { userId: new mongoose.Types.ObjectId(String(userId)), 'hieracy._id': new mongoose.Types.ObjectId(String(dirId)) }, // Find by userId and directory's _id
//             { 'hieracy.$': updateData }, // Update the directory data
//             { new: true } // Return the updated document
//         );

//         if (!directory) {
//             // return res.status(404).json({ error: "Directory not found." });
//             return res.json({ error: "Directory not found." });
//         }

//         // res.status(200).json(directory);
//         res.json(directory);
//     } catch (error) {
//         console.error("Error editing directory: ", error);
//         // res.status(500).json({ error: "Failed to edit directory." });
//         res.json({ error: "Failed to edit directory." });
//     }
// }

async function editDirectory(req, res) {
    const userId = new mongoose.Types.ObjectId(String(req.user.userId));
    const { action } = req.body; // Assuming you're passing the directoryId and new name in the request body

    try {
        // Find the user's directory document
        const userDirectory = await UserDirectory.findOne({ userId });

        if (!userDirectory) {
            return res.json({ message: "Directory not found" });
        }

        // Recursive function to find and update the subdirectory
        // const updateSubDirectory = (subDirs) => {
        //     for (const subDir of subDirs) {
        //         if (subDir._id.toString() === directoryId) {
        //             subDir.name = newName; // Update the name or any other field you want
        //             return true; // Return true if updated
        //         }
        //         if (subDir.subDirs && subDir.subDirs.length > 0) {
        //             const updated = updateSubDirectory(subDir.subDirs); // Recur for subdirectories
        //             if (updated) return true; // If updated in the recursion, return true
        //         }
        //     }
        //     return false; // If not found
        // };

        // console.log("hieracy : ", userDirectory.hieracy)
        // // Start updating from the top-level hierarchy
        // const updated = updateSubDirectory([userDirectory.hieracy]);

        // if (!updated) {
        //     return res.json({ message: "Subdirectory not found" });
        // }

        switch(action){
            case "create-directory": {
                const {directoryId, name} = req.body;
                createSubDirectory(directoryId, name, userDirectory.hieracy)
                break
            }
            case "delete-directory": {
                const {parentDirId, deleteDirId} = req.body;
                deleteSubDirectory(parentDirId, deleteDirId, userDirectory.hieracy)
                break
            }
            case "rename-directory":{
                const {directoryId, newName} = req.body;
                renameSubDirectory(directoryId, userDirectory.hieracy, newName)
                break
            }
            case "move": {
                console.log("move data / folder")
                // action: clipboard.operation,
                // type: clipboard.type,
                // contentId: clipboard.content._id,
                // currentParentDirectoryId: clipboard.currentParentDir._id,
                // newParentDirectoryId: newParentDir._id
                const {type, contentId, currentParentDirectoryId, newParentDirectoryId} = req.body
                console.log({type, contentId, currentParentDirectoryId, newParentDirectoryId})
                switch(type){
                    case "dir": {
                        moveSubDirectory(contentId, userDirectory.hieracy, currentParentDirectoryId, newParentDirectoryId)
                        break
                    }
                    // TODO : add functions for other types : note, blog, link, video
                    case "note":
                    case "file":
                    case "video":
                    case "link":{
                        moveDataFromDirectory(type, contentId, userDirectory.hieracy, currentParentDirectoryId, newParentDirectoryId)
                        break
                    }
                    default:{
                        res.json({Error: "Type of data provided is not supported"})
                    }
                }
                break
            }
            case "copy": {
                // action: clipboard.operation,
                // type: clipboard.type,
                // contentId: clipboard.content._id,
                // currentParentDirectoryId: clipboard.currentParentDir._id,
                // newParentDirectoryId: newParentDir._id
                console.log("copy req")
                const {type, contentId, currentParentDirectoryId, newParentDirectoryId} = req.body
                console.log({type, contentId, currentParentDirectoryId, newParentDirectoryId})
                switch(type){
                    case "dir": {
                        copySubDirectory(contentId, userDirectory.hieracy, currentParentDirectoryId, newParentDirectoryId)
                        break
                    }
                    // DONE : TODO : add functions for other types : note, blog, link, video
                    case "note":
                    case "file":
                    case "video":
                    case "link":{
                        copyDataFromDirectory(type, contentId, userDirectory.hieracy, currentParentDirectoryId, newParentDirectoryId)
                        break
                    }
                    default:{
                        res.json({Error: "Type of data provided is not supported"})
                    }
                }
                break
            }
            case "delete": {
                const {type, contentId, parentDirectoryId} = req.body
                switch(type){
                    case "dir":{
                        deleteSubDirectory(parentDirectoryId, contentId, userDirectory.hieracy)
                        break
                    }
                    case "note":
                    case "file":
                    case "video":
                    case "link":{
                        removeDataFromDirectory(parentDirectoryId, userDirectory.hieracy, type, contentId)
                        break
                    }
                    default:{
                        res.json({Error: "Type of data provided is not supported"})
                    }
                }

                break
            }
            case "add-data":{
                const {directoryId, type, ref} = req.body
                const types = ["note", "video", "link", "file"]
                if(types.indexOf(type) >= 0){
                    addDataToDirectory(directoryId, userDirectory.hieracy, type, ref)
                }else{
                    res.json({Error: "Type of data provided is not supported"})
                    return
                }
                break
            }
            case "remove-data":{
                const {directoryId, type, ref} = req.body
                const types = ["note", "video", "link", "file"]
                if(types.indexOf(type) >= 0){
                    removeDataFromDirectory(directoryId, userDirectory.hieracy, type, ref)
                }else{
                    res.json({Error: "Type of data provided is not supported"})
                    return
                }
                break
            }
        }

        // Save the updated directory back to the database
        await userDirectory.save();
        res.json({ message: "Directory updated successfully",  hieracy: userDirectory.hieracy});
    } catch (error) {
        console.error(error);
        res.json({ message: "An error occurred while updating the directory" });
    }
}


// Delete a directory
async function deleteDirectory(req, res) {
    const userId = req.user.userId;
    const { dirId } = req.params; // Directory ID to delete

    try {
        const directory = await UserDirectory.findOneAndUpdate(
            { userId },
            { $pull: { hieracy: { _id: dirId } } }, // Remove the directory by its _id
            { new: true }
        );

        if (!directory) {
            return res.status(404).json({ error: "Directory not found." });
        }

        res.status(200).json({ message: "Directory deleted successfully." });
    } catch (error) {
        console.error("Error deleting directory: ", error);
        res.status(500).json({ error: "Failed to delete directory." });
    }
}

// Retrieve directory hierarchy
async function getDirectory(req, res) {
    const userId = req.user.userId;

    try {
        const directory = await UserDirectory.findOne({ userId });
        if (!directory) {
            // return res.status(404).json({ error: "Directory not found." });
            return res.json({ error: "Directory not found." });
        }

        // res.status(200).json(directory.hieracy); // Return only the hierarchy structure
        res.json(directory.hieracy); // Return only the hierarchy structure
    } catch (error) {
        console.error("Error retrieving directory: ", error);
        // res.status(500).json({ error: "Failed to retrieve directory." });
        res.json({ error: "Failed to retrieve directory." });
    }
}

async function search(req, res){
    const uid = strToObjId(req.user.userId)
    const search = req.body.search
    const files = await File
        .find({userId: uid, $text: { $search: search }},
            {score: { $meta: "textScore" }})
        .sort({score: { $meta: "textScore" }})
    const notes = await Note
        .find({userId: uid, $text: { $search: search }},
            {score: { $meta: "textScore" }})
        .sort({score: { $meta: "textScore" }})
    const links = await Link
        .find({userId: uid, $text: { $search: search }},
            {score: { $meta: "textScore" }})
        .sort({score: { $meta: "textScore" }})
    res.json({files, notes, links, videos: []})
}

module.exports = {
    search,
    createDirectory,
    editDirectory,
    deleteDirectory,
    getDirectory
};
