const mongoose = require("mongoose")
const { strToId } = require("../../chatServer/util/userIdUtil")

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User", // Reference to the User collection
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    savePath: {
        type: String,
        default: ""
    },
    fileType: {
        type: String,
        enum: ["mp4", "jpg", "jpeg", "png", "pdf", "docx", "xlsx", "txt", "csv", "gif", "pptx", "zip", "rar", "other"],
        required: true,
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED", "CHAT", "GROUP"],
        // TODO : FRIENDS ONLY - Friend list of a user is required
        default: "PRIVATE",
    },
    sharedWith: [
        {
            email: {
                type: String,
                required: true,
            },
        }
    ],
    license: {
        type: String,
        enum: ["MIT", "GPL", "APACHE", "CC", "NONE"],
        default: "NONE"
    },
    tags: [
        {
            type: "String",
        }
    ],
    author: {
        type: String,
        enum: ["ME", "OTHER"],
        require: true
    },
    authorName: {
        type: String,
        default: ""
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
})

fileSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

fileSchema.index({_id: 1, userId: 1}, {unique: true})
fileSchema.index({ visibility: 1, tags: 1 });
fileSchema.index({name: "text", description: "text"})

fileSchema.statics = {
    createFile: async function (userId, name, description, savePath, fileType, visibility = "PRIVATE", license = "NONE", sharedWith = [], tags=null, author="ME", authorName="") {
        // Validate visibility
        const validVisibilities = ["PRIVATE", "PUBLIC", "SHARED", "CHAT", "GROUP"];
        if (!validVisibilities.includes(visibility)) {
            throw new Error("Invalid visibility value.");
        }

        // Create the new file
        console.log("file created")
        console.log("tags tagstagstagstagstagstagstagstagstagstagstagstags: ", tags)
        const newFile = new this({
            userId,
            name,
            description,
            savePath,
            fileType,
            visibility,
            license,
            sharedWith: visibility === "SHARED" ? sharedWith : [], // Only set sharedWith if SHARED
            tags: tags ? JSON.parse(tags) : [],
            author,
            authorName
        });
        
        await newFile.save();
        console.log("file saved")
        return newFile;
    },

    deleteFile: async function (userId, fileId) {
        // TODO : What if a user deltes a file that is being shared with others either
        // through the feed or specifying through sharedWith field
        // In a such situation other users that had access to the file 
        // should be notified that this file has been remoed by the owner
        // of the file to do that add a filed to that specifies the file
        // had been deleted so that when the other users try to access the file
        // an error message can be shown

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
    },
    getPublicFiles: async function (userId){
        const files = await this.find({userId: strToId(userId), visibility: "PUBLIC"},
        {savePath: 0, sharedWith: 0})
        return files
    }
};

const File = mongoose.model("File", fileSchema);
module.exports = File