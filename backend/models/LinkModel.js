const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
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
    isPublic: {
        type: Boolean,
        default: false
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED", "CHAT", "GROUP"],
        // TODO : FRIENDS ONLY - Friend list of a user is required
        default: "PRIVATE",
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

LinkSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

LinkSchema.index({_id: 1, userId: 1}, {unique: true})
LinkSchema.index({name: "text", description: "text"})

LinkSchema.statics = {
    createLink: async function (userId, name, description, link, isPublic, license){
        const newLink = new this({userId, name, description, link, isPublic: isPublic ? isPublic : false, license: license ? license : "NONE"})
        await newLink.save()
        return newLink
    },
    deleteLink: async function (userId, linkId){
        // if the visibiility is private just delete the linkObj
        const deletedLink = await this.deleteOne({_id: linkId, userId})
        // TODO : if the linkObj is public, what would happen to the copies
        return deletedLink
    },
    editLink: async function (userId, linkId, name, description, link, visibiility, license){
        const linkObj = await this.findOne({_id: linkId, userId})
        if(name) linkObj.name = name
        if(description) linkObj.description = description
        // TODO : sanatize conten
        if(link) linkObj.link = link
        if(visibiility) linkObj.visibiility = visibiility
        if(license) linkObj.license = license
        await linkObj.save()
    },
    getLink: async function (userId, linkId){
        const linkObj = await this.findOne({_id: linkId, userId})
        return linkObj
    }
}

const Link = mongoose.model("Link", LinkSchema);
module.exports = Link