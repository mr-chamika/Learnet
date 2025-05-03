const mongoose = require("mongoose")
const { findDirectory } = require("../utils/DirectoryUpdates")

function getDepth(subDirs, currentDepth = 0){
    console.log(currentDepth)
    if(!subDirs || !Array.isArray(subDirs) || subDirs.length === 0) return currentDepth
    let maxDepth = 0
    for(const dir of subDirs){
        const depth = getDepth(dir.subDirs, currentDepth + 1)
        if(depth > maxDepth){
            maxDepth = depth
        }
    }

    return maxDepth
}

const DirectorySchema = new mongoose.Schema()

DirectorySchema.add({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Unique _id for each subdirectory
    name: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    notes: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    videos: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    links: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    files: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    subDirs: {
        type: [DirectorySchema], // Recursive subdirectory structure
        validate: {
            validator: function(subDirs) {
                const maxDepth = 5;
                return getDepth(subDirs) <= maxDepth;
            },
            message: props => "Maximum subdirectory depth of 5 exceeded."
        }
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

DirectorySchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

const UserDirectorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        unique: true // Ensure that only one document per user exists
    },
    hieracy: {
        type: DirectorySchema,
        required: true
    }
});

UserDirectorySchema.statics = {
    findDirectory: async function(userId){
        return await UserDirectory.findOne({ userId })
    }
}

UserDirectorySchema.methods = {
    findSubDir: function(dirId){
        const dir = findDirectory([this.hieracy], dirId, null)
        if(!dir) throw Error("Directory for the provided ID cannot be found")
        return dir
    }
}

DirectorySchema.methods = {
    addData: function(type, data){
        switch(type){
            case "note":
                this.notes.push(data)
                break
            case "video":
                this.videos.push(data)
                break
            case "link":
                this.links.push(data)
                break
            case "file":
                this.files.push(data)
                break
            default:
                throw Error("Unknown type")
        }
    }
}

const UserDirectory = mongoose.model("UserDirectory", UserDirectorySchema);

module.exports = UserDirectory