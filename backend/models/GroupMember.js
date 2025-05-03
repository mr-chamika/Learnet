const mongoose = require('mongoose');
const { strToObjId } = require('../utils/strToObjId');
const Schema = mongoose.Schema;

const groupMemberSchem = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  unreadMessageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before each save
groupMemberSchem.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

groupMemberSchem.statics = {
  createGroupMember: async function(groupId, userId){
    const newGroupMember = new this({groupId, userId, unreadMessageCount: 1})
    await newGroupMember.save()
    return newGroupMember
  },
  removeGroupMember: async function(groupId, userId){
    const groupMember = await this.findOneAndDelete({groupId, userId})
    return groupMember
  },
  getGroupMember: async function(groupId, userId){
    const uid = strToObjId(userId)
    const groupMember = await this.findOne({groupId, userId: uid})
    return groupMember
  },
  incrementMessageCount: async function(groupId, userId){
    const uid = strToObjId(userId)
    const groupMember = await this.findOneAndUpdate({groupId, userId: uid}, {$inc: {unreadMessageCount: 1}}, {returnOriginal: false})
    return groupMember
  }, 
  resetUnreadMessageCount: async function(groupId, userId){
    const uid = strToObjId(userId)
    const groupMember = await this.findOneAndUpdate({groupId, userId: uid}, {unreadMessageCount: 0}, {returnOriginal: false})
    return groupMember
  }
}

groupMemberSchem.methods = {
  update: async function(unreadMessageCount){
    this.unreadMessageCount = unreadMessageCount
    return await this.save()
  },
  reset: async function(){
    this.unreadMessageCount = 0
    return await this.save()
  }
  // incrementMessageCount: async function(){
  //   this.unreadMessageCount
  // }
}

const GroupMember = mongoose.model('GroupMember', groupMemberSchem);
module.exports = GroupMember;
