const mongoose = require('mongoose');
const { strToId } = require('../util/userIdUtil');
const Schema = mongoose.Schema;

// Group Settings Schema
const userSchem = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    // ref: 'Group',
    required: true,
    unique: true
  },
  groups: [{
    type: Schema.Types.ObjectId,
    required: true
  }],
  communities: [{
    type: Schema.Types.ObjectId,
    required: true
  }],
  chats: [{
    type: Schema.Types.ObjectId,
    required: true
  }],
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
userSchem.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchem.statics = {
  createUser: async function(id){
    const uid = strToId(id)
    const user = new this({userId: uid, groups: [], chats: []})
    await user.save()
    return user
  },
  getUserById: async function(id){
    const uid = strToId(id)
    const user = await this.findOne({userId: uid})
    return user
  },
  getUserGroups: async function(id){
    const uid = strToId(id)
    const user = await this.findOne({userId: uid}, {groups: 1})
    return user.groups
  },
  getUserChats: async function(id){
    const user = await this.getUserById(id)
    return user.chats
  },
  addGroupsToUsers: async function(userIds, groupIds){
    console.log("userIds : ", userIds)
    const info = await this.updateMany(
      { userId: { $in: userIds } },
      { $addToSet: { groups: { $each: groupIds } } }
    )
  },
  removeGroupsFromUsers: async function(userIds, groupIds){
    console.log("userIds : ", userIds)
    const info = await this.updateMany(
      { userId: { $in: userIds } },
      { $pull: { groups: { $in: groupIds } } }
    )
  },
  addCommunitiesToUsers: async function(userIds, groupIds){
    console.log("userIds : ", userIds)
    const info = await this.updateMany(
      { userId: { $in: userIds } },
      { $addToSet: { communities: { $each: groupIds } } }
    )
  },
  removeCommunitiesFromUsers: async function(userIds, groupIds){
    console.log("userIds : ", userIds)
    const info = await this.updateMany(
      { userId: { $in: userIds } },
      { $pull: { communities: { $in: groupIds } } }
    )
  }
}

userSchem.methods = {
  addGroup: async function(groupId){
    const index = this.groups.indexOf(groupId)
    if(index < 0){
      this.groups.push(groupId)
    }
    await this.save()
    return this
  },
  addCommunity: async function(communityId){
    const index = this.communities.indexOf(communityId)
    if(index < 0){
      this.communities.push(communityId)
    }
    await this.save()
    return this
  },
  removeGroup: async function(groupId){
    const index = this.groups.indexOf(groupId)
    if(index >= 0){
      this.groups.splice(index, 1)
    }
    await this.save()
    return this
  }
}

const User = mongoose.model('UserChat', userSchem);
module.exports = User;
