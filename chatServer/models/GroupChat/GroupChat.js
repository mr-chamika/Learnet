const mongoose = require("mongoose")
const {strToId, orderUID} = require("../../util/userIdUtil")

const groupChatSchema = new mongoose.Schema({
    senderId:{ // sender of the last message
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    lastMessage: {
        type: String,
        require: true
    },
    lastMessageType: {
        type: String,
        enum: ["text", "video", "image", "note", "link","event", "update"],
        default: "text"
    },
    unreadMessageCount: {
        type: Number,
        require: true
    },
    lastMessageTimestamp: { type: Date, default: Date.now }
})

groupChatSchema.statics.createGroupChat = async function(senderId, lastMessage, lastMessageType){
    const newChat = new this({
        senderId: strToId(senderId),
        lastMessage,
        lastMessageType,
        unreadMessageCount: 1
    })

    return await newChat.save()
}

groupChatSchema.statics.findChat = async function(groupChatId){
    const gcId = strToId(groupChatId)
    console.log("group chat id : ", gcId)
    return await this.findOne({_id: gcId})
}

// groupChatSchema.statics.getChatList = async function(userId){
//     const uid = strToId(userId)
//     return await this.find({$or: [{userId1: uid}, {userId2: uid}]})
// }

groupChatSchema.methods = {
    isSender: function(userId){
        if(strToId(userId).equals(this.senderId)) return true
        return false
    },
    updateChat: async function(lastMessage){
        this.lastMessage = lastMessage.message
        this.lastMessageType = lastMessage.type
        this.lastMessageTimestamp = lastMessage.timestamp
        this.senderId = lastMessage.senderId
        return await this.save()
    }
}

// groupChatSchema.methods.increaseUnreadCount = async function(message){
//     this.lastMessage = message
//     this.unreadMessageCount += 1
//     await this.save()
// }

// groupChatSchema.methods.resetLastMessage = async function(message, senderId){
//     this.lastMessage = message
//     this.unreadMessageCount = 0
//     this.senderId = strToId(senderId)
//     await this.save()
// }

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
module.exports = GroupChat