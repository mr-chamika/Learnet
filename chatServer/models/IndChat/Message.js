const mongoose = require("mongoose");
const { orderUID, strToId } = require("../../util/userIdUtil");

// Define the message schema and model
// const messageSchema = new mongoose.Schema({
//     sender: String,
//     recipient: String,
//     content: String,
//     timestamp: { type: Date, default: Date.now },
//     isRead: { type: Boolean, default: false }, // To mark if recipient has read the message
//   });

const msgSchema = new mongoose.Schema({
    userId1: { // sender
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    userId2: { // receiver
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    type: {
        type: String,
        enum: ["text", "video", "image", "note", "link", "event", "update"],
        default: "text"
    },
    message: {
        type: String,
        require: true
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // To mark if recipient has read the message
  });

msgSchema.pre("find", function() {
    this._startTime = Date.now();
})

msgSchema.post("find", function() {
    if(this._startTime != null){
        console.log("Running time of the query (ms) : ", Date.now() - this._startTime); // in ms
    }
})

msgSchema.index({userId1: 1, userId2: 1})

msgSchema.statics.createMessage = function(userId1, userId2, type, message){
    // const [uid1, uid2] = orderUID(userId1, userId2)
    return new this({userId1, userId2, type, message})
}

msgSchema.statics.getMessages = async function(userId1, userId2){
    const messageBatchSize = 100
    const uid1 = strToId(userId1)
    const uid2 = strToId(userId2)
    // return this.find({$or: [{userId1: senderUID, userId2: receiverUID}, {userId1: receiverUID, userId2: senderUID}]})
    const messageList=  await this
            .find({$or: [{userId1: uid1, userId2: uid2, isRead: true}, {userId1: uid2, userId2: uid1, isRead: true}]}, {__v: 0})
            .limit(messageBatchSize)
            .sort({timestamp: 1})
            .hint({userId1: 1, userId2: 1})
    const unreadMessageList = await this
            .find({$or: [{userId1: uid1, userId2: uid2, isRead: false}, {userId1: uid2, userId2: uid1, isRead: false}]}, {__v: 0})
            .sort({timestamp: 1})
            .hint({userId1: 1, userId2: 1})
    return [messageList, unreadMessageList]
}

msgSchema.methods.markAsRead = function(){
    this.isRead = true
}

msgSchema.statics.markMessagesAsRead = async function(messageList){
    for(let msg of messageList){
        console.log("marking : ", msg)
        msg.markAsRead()
        await msg.save()
    }
}

// ------------------------ DB -------------------------------------
const Message = mongoose.model('Message', msgSchema);
module.exports = Message