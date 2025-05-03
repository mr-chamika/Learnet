const mongoose = require("mongoose");

const VidoeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ""
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED", "CHAT", "GROUP"],
        // TODO : FRIENDS ONLY - Friend list of a user is required
        default: "PRIVATE",
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    license: {
        type: String,
        enum: ["MIT", "GPL", "APACHE", "CC", "NONE"],
        default: "NONE"
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

VidoeSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

VidoeSchema.index({_id: 1, userId: 1}, {unique: true})
VidoeSchema.index({name: "text", description: "text"})

VidoeSchema.statics = {
    createVideo: async function (userId, name, description, link, isPublic, license){
        const newVideo = new this({userId, name, description, link, isPublic: isPublic ? isPublic : false, license: license ? license : "NONE"})
        await newVideo.save()
        return newVideo
    },
    deleteVideo: async function (userId, videoId){
        // if the visibiility is private just delete the note
        const deleteVideo = await this.deleteOne({_id: videoId, userId})
        // TODO : if the note is public, what would happen to the copies
        return deleteVideo
    },
    editVideo: async function (userId, noteId, name, description, link, visibiility, license){
        const video = await this.findOne({_id: noteId, userId})
        if(name) video.name = name
        if(description) video.description = description
        // TODO : sanatize conten
        if(link) video.link = link
        if(visibiility) video.visibiility = visibiility
        if(license) video.license = license
        await video.save()
    },
    getVideo: async function (userId, videoId){
        const video = await this.findOne({_id: videoId, userId})
        return video
    }
}

const Video = mongoose.model("Video", VidoeSchema);
module.exports = Video