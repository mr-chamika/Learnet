const mongoose = require("mongoose")

function strToObjId(id){
    if(!(id instanceof mongoose.Types.ObjectId)){
        return id
    }

    return new mongoose.Types.ObjectId(String(id))
}

module.exports = {strToObjId}