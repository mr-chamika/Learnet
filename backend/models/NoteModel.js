const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
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
    content: {
        type: String,
        default: ""
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED"],
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
    // tags: [
    //     {
    //         type: "String",
    //     }
    // ],
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

NoteSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

NoteSchema.index({_id: 1, userId: 1}, {unique: true})
NoteSchema.index({ visibility: 1, tags: 1 });
NoteSchema.index({name: "text", description: "text"})

// NoteSchema.statics = {
//     createNote: async function (userId, name, description, content, isPublic, license){
//         const newNote = new this({userId, name, description, content, isPublic: isPublic ? isPublic : false, license: license ? license : "NONE"})
//         await newNote.save()
//         return newNote
//     },
//     deleteNote: async function (userId, noteId){
//         // if the visibiility is private just delete the note
//         const deletedNote = await this.deleteOne({_id: noteId, userId})
//         // TODO : if the note is public, what would happen to the copies
//         return deletedNote
//     },
//     editNote: async function (userId, noteId, name, description, content, visibiility, license){
//         const note = await this.findOne({_id: noteId, userId})
//         if(name) note.name = name
//         if(description) note.description = description
//         // TODO : sanatize conten
//         if(content) note.content = content
//         if(visibiility) note.visibiility = visibiility
//         if(license) note.license = license
//         await note.save()
//     },
//     getNote: async function (userId, noteId){
//         const note = await this.findOne({_id: noteId, userId})
//         return note
//     }
// }

NoteSchema.statics = {
    createNote: async function (userId, name, description, content, visibility = "PRIVATE", license = "NONE", sharedWith = []) {
        // Validate visibility
        const validVisibilities = ["PRIVATE", "PUBLIC", "SHARED"];
        if (!validVisibilities.includes(visibility)) {
            throw new Error("Invalid visibility value.");
        }

        // Create the new note
        const newNote = new this({
            userId,
            name,
            description,
            content,
            visibility,
            license,
            sharedWith: visibility === "SHARED" ? sharedWith : [] // Only set sharedWith if SHARED
        });

        await newNote.save();
        return newNote;
    },

    deleteNote: async function (userId, noteId) {
        // Fetch the note to check its visibility
        // const note = await this.findOne({ _id: noteId, userId });

        // if (!note) {
        //     throw new Error("Note not found or access denied.");
        // }

        // if (note.visibility === "PUBLIC") {
        //     // Handle what happens to the public copies (e.g., log or notify users)
        //     // For now, just delete the note
        // }

        // Delete the note
        const deletedNote = await this.deleteOne({ _id: noteId, userId });
        return deletedNote;
    },

    editNote: async function (userId, noteId, updates) {
        // Fetch the note
        const note = await this.findOne({ _id: noteId, userId });

        if (!note) {
            throw new Error("Note not found or access denied.");
        }

        const { name, description, content, visibility, license, sharedWith } = updates;

        // Apply updates
        if (name) note.name = name;
        if (description) note.description = description;
        if (content) {
            // TODO: Add sanitization logic for content
            note.content = content;
        }
        if (visibility) {
            const validVisibilities = ["PRIVATE", "PUBLIC", "SHARED"];
            if (!validVisibilities.includes(visibility)) {
                throw new Error("Invalid visibility value.");
            }
            note.visibility = visibility;

            // Adjust `sharedWith` based on visibility
            if (visibility === "SHARED") {
                note.sharedWith = sharedWith || []; // Set sharedWith only if provided
            } else {
                note.sharedWith = []; // Clear sharedWith for PRIVATE or PUBLIC visibility
            }
        }
        if (license) note.license = license;

        await note.save();
        return note;
    },

    getNote: async function (userId, noteId) {
        console.log('get note : ', userId, noteId)
        // Fetch the note only if it's PRIVATE or belongs to the user
        const note = await this.findOne({
            _id: noteId,
            $or: [
                { userId },
                { visibility: { $in: ["PUBLIC", "SHARED"] }, "sharedWith.email": userId } // Handles PUBLIC and SHARED notes
            ]
        });

        if (!note) {
            // throw new Error("Note not found or access denied.");
        }

        return note;
    }
};


const Note = mongoose.model("Note", NoteSchema);
module.exports = Note