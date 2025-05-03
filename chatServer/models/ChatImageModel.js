// used to store metadata of group images and community images

const mongoose = require("mongoose")

const chatImageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User", // Reference to the User collection
    },
    savePath: {
        type: String,
        default: ""
    },
    // fileType: {
    //     type: String,
    //     enum: ["mp4", "jpg", "jpeg", "png", "pdf", "docx", "xlsx", "txt", "csv", "gif", "pptx", "zip", "rar", "other"],
    //     required: true,
    // },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED"],
        // TODO : FRIENDS ONLY - Friend list of a user is required
        default: "PRIVATE",
    },
    groupId: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    communityId: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    // createdOn: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedOn: {
    //     type: Date,
    //     default: Date.now
    // }
})

// chatImageSchema.pre("save", function(next){
//     this.updatedOn = Date.now()
//     next()
// })

chatImageSchema.index({_id: 1, userId: 1}, {unique: true})

chatImageSchema.statics = {
    createFile: async function (userId, savePath, visibility = "PRIVATE", ) {
        // Validate visibility
        const validVisibilities = ["PRIVATE", "PUBLIC"];
        if (!validVisibilities.includes(visibility)) {
            throw new Error("Invalid visibility value.");
        }

        // Create the new file
        const newFile = new this({
            userId,
            savePath,
            // fileType,
            visibility,
        });
        
        await newFile.save();
        console.log("file saved")
        return newFile;
    },

    deleteFile: async function (userId, fileId) {
        // Delete the file
        const deletedFile = await this.deleteOne({ _id: fileId, userId });
        return deletedFile;
    },

    editFile: async function (userId, fileId, updates) {
        // Fetch the file
        const file = await this.findOne({ _id: fileId, userId });

        if (!file) {
            throw new Error("File not found or access denied.");
        }

        const { name, description, content, visibility, license, sharedWith } = updates;

        // Apply updates
        if (name) file.name = name;
        if (description) file.description = description;
        if (content) {
            // TODO: Add sanitization logic for content
            file.content = content;
        }
        if (visibility) {
            const validVisibilities = ["PRIVATE", "PUBLIC", "SHARED"];
            if (!validVisibilities.includes(visibility)) {
                throw new Error("Invalid visibility value.");
            }
            file.visibility = visibility;

            // Adjust `sharedWith` based on visibility
            if (visibility === "SHARED") {
                file.sharedWith = sharedWith || []; // Set sharedWith only if provided
            } else {
                file.sharedWith = []; // Clear sharedWith for PRIVATE or PUBLIC visibility
            }
        }
        if (license) file.license = license;

        await file.save();
        return file;
    },

    getFile: async function (userId, fileId) {
        // Fetch the file only if it's PRIVATE or belongs to the user
        const file = await this.findOne({
            _id: fileId,
            $or: [
                { userId },
                { visibility: "PUBLIC"}, // Handles PUBLIC and SHARED files
                { visibility: "SHARED", "sharedWith.email": userId } // Handles PUBLIC and SHARED files
                // TODO : FRIENDS ONLY
            ]
        });

        if (!file) {
            throw new Error("File not found or access denied.");
        }

        return file;
    }
};

const ChatImage = mongoose.model("ChatImage", chatImageSchema);
module.exports = ChatImage