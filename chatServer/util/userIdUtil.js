const mongoose = require("mongoose")

function strToId(userIdStr){
    if(typeof userIdStr === "string"){
        return new mongoose.Types.ObjectId(String(userIdStr))
    }else if(userIdStr instanceof mongoose.Types.ObjectId){
        return userIdStr
    }else{
        throw Error("userIdStr provided is not a string nor a ObjectId")
    }
}

function orderUID(userId1, userId2){
    let uid1, uid2
    if(userId1 < userId2){
        uid1 = strToId(userId1)
        uid2 = strToId(userId2)
    }else{
        uid1 = strToId(userId2)
        uid2 = strToId(userId1)
    }
    return [uid1, uid2]
}

function isSameUser(userId1, userId2){
    const uid1 = strToId(userId1)
    const uid2 = strToId(userId2)
    if(uid1.equals(uid2)) return true
    return false
}

module.exports = {strToId, orderUID, isSameUser}