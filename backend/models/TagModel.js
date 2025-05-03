const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    // description: {
    //     type: String,
    //     required: true
    // },
    type: {
        type: String,
        enum: ["predefined", "userdefined"],
        default: "userdefined"
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

TagSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

// TagSchema.index({_id: 1, userId: 1}, {unique: true})
// TagSchema.index({name: "text", description: "text"})

TagSchema.statics = {
    createTag: async function (userId, name, description) {
        const newTag = new this({
            userId,
            name,
            description,
        });

        await newTag.save();
        return newTag;
    },

    deleteTag: async function (userId, tagId) {
        const deletedNote = await this.deleteOne({ _id: noteId, userId });
        return deletedNote;
    },

    // editNote: async function (userId, noteId, updates) {
    //     // Fetch the note
    //     const note = await this.findOne({ _id: noteId, userId });

    //     if (!note) {
    //         throw new Error("Tag not found or access denied.");
    //     }

    //     const { name, description, content, visibility, license, sharedWith } = updates;

    //     // Apply updates
    //     if (name) note.name = name;
    //     if (description) note.description = description;
    //     if (content) {
    //         // TODO: Add sanitization logic for content
    //         note.content = content;
    //     }
    //     if (visibility) {
    //         const validVisibilities = ["PRIVATE", "PUBLIC", "SHARED"];
    //         if (!validVisibilities.includes(visibility)) {
    //             throw new Error("Invalid visibility value.");
    //         }
    //         note.visibility = visibility;

    //         // Adjust `sharedWith` based on visibility
    //         if (visibility === "SHARED") {
    //             note.sharedWith = sharedWith || []; // Set sharedWith only if provided
    //         } else {
    //             note.sharedWith = []; // Clear sharedWith for PRIVATE or PUBLIC visibility
    //         }
    //     }
    //     if (license) note.license = license;

    //     await note.save();
    //     return note;
    // },

    getTags: async function (userId, noteId) {
        // const note = await this.findById;

        // if (!note) {
        //     throw new Error("Tag not found or access denied.");
        // }

        // return note;
    }
};


const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag