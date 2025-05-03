const mongoose = require("mongoose")
const { strToId } = require("../../chatServer/util/userIdUtil")

const UserFriendsSchema = new mongoose.Schema({
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores the user IDs of friends
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores user IDs of pending requests sent
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores user IDs of pending requests received
}, { timestamps: true });

UserFriendsSchema.index({ friends: 1 });

const UserFriends = mongoose.model("UserFriends", UserFriendsSchema)
module.exports = UserFriends