const mongoose = require("mongoose")
const {strToId, orderUID} = require("../../util/userIdUtil")

const chatSchema = new mongoose.Schema({
    userId1: { //main - user
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    userId2: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
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

chatSchema.statics.createChat = async function(userId1, userId2, senderId, lastMessage, lastMessageType){
    const [uid1, uid2] = orderUID(userId1, userId2)
    return new this({
        userId1: uid1,
        userId2: uid2,
        senderId: strToId(senderId),
        lastMessage,
        lastMessageType,
        unreadMessageCount: 1
    })
}

chatSchema.statics.findChat = async function(userId1, userId2){
    // return await this.findOne({$or: [{userId1, userId2}, {userId1: userId2, userId2: userId1}]})
    
    // let uid1 = new mongoose.Types.ObjectId(String(userId1))
    // let uid2 = new mongoose.Types.ObjectId(String(userId2))
    // if(userId1 < userId2){
    //     return this.findOne({userId1, userId2})
    // }else{
    //     return this.findOne({userId1: userId2, userId2: userId1})
    // }

    const [uid1, uid2] = orderUID(userId1, userId2)
    return this.findOne({userId1: uid1, userId2: uid2})
}

chatSchema.statics.getChatList = async function(userId){
    const uid = strToId(userId)
    return await this.find({$or: [{userId1: uid}, {userId2: uid}]})
}

chatSchema.methods.isSender = function(userId){
    console.log(strToId(userId), this.senderId)
    console.log(strToId(userId).equals(this.senderId))
    if(strToId(userId).equals(this.senderId)) return true
    return false
}

chatSchema.methods.increaseUnreadCount = async function(messageObj){
    this.lastMessage = messageObj.message
    this.lastMessageType = messageObj.type
    this.lastMessageTimestamp = messageObj.timestamp
    this.unreadMessageCount += 1
    await this.save()
}

chatSchema.methods.resetLastMessage = async function(messageObj, senderId){
    this.lastMessage = messageObj.message
    this.lastMessageType = messageObj.type
    this.lastMessageTimestamp = messageObj.timestamp
    this.unreadMessageCount = 0
    this.senderId = strToId(senderId)
    await this.save()
}

chatSchema.methods.resetUnreadMessageCount = async function(){
    this.unreadMessageCount = 0
    await this.save()
}

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat