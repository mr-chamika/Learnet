const activeContactListSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    activeContactList: {
        type: Array,
        require: true
  }
})



const ActiveContactList = mongoose.model("ActiveContactList", activeContactListSchema)
module.exports = ActiveContactList