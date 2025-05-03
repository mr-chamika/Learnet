const mongoose = require("mongoose");
const GroupMember = require("./GroupMember");

const groupMessagesSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    senderId: {
        type: mongoose.SchemaTypes.ObjectId,
        // require: true
        default: null
    },
    type: {
        type: String,
        enum: ["text", "video", "image", "note", "link","event", "update"],
        default: "text"
    },
    message: {
        type: String,
        require: true
    },
    fileIds: [
        {
            type: mongoose.SchemaTypes.ObjectId
        }
    ],
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // To mark if recipient has read the message
  });

// groupMessagesSchema.index({
//     timestamp: -1
// },
// {
//     unique: false,
//     expireAfterSeconds: 86400 // expires after a day
// })

groupMessagesSchema.pre("find", function() {
    this._startTime = Date.now();
})

groupMessagesSchema.post("find", function() {
    if(this._startTime != null){
        console.log("Running time of the query (ms) : ", Date.now() - this._startTime); // in ms
    }
})

groupMessagesSchema.statics = {
    createMessage: async function(groupId, senderId, message, type, fileIds){
        console.log("file Ids : ", fileIds)
        const newMessage = new this({groupId, senderId, message, type, fileIds})
        return await newMessage.save()
    },
    getMessages: async function(groupId, userId){
        // console.log("user Id : ", userId)
        const groupMember = await GroupMember.getGroupMember(groupId, userId)
        // console.log("group member : ", groupMember)
        const unreadMessageCount = groupMember.unreadMessageCount
        const messages = await this.find({ groupId })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order
            .limit(unreadMessageCount + 100)              // Limit to 100 read messages
            .exec();
        // console.log("messages : ", messages)
        // return messages
        return [messages.slice(unreadMessageCount, messages.length), messages.slice(0, unreadMessageCount)]
    },
    // getMessagesSplit: async function(groupId, userId){
    //     const msgs = await this.getMessages(groupId, userId)
    //     console.log("msgs count : ", msgs[0], msgs[1])
    //     const messages = msgs.slice(-100, -1)
    //     const unreadMessages = msgs.slice(0, -101)
    //     return [messages, unreadMessages]
    // }
}

const GroupMessage = mongoose.model('GroupMessage', groupMessagesSchema);
module.exports = GroupMessage