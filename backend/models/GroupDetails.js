const mongoose = require('mongoose');
const { strToObjId } = require('../utils/strToObjId');
const GroupMember = require('./GroupMember');
const Schema = mongoose.Schema;

// Group Schema
const groupDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId, // User who created the group
    // ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId, // Array of User IDs
    // ref: 'User'
    required: true
  }],
  admins: [{
    type: Schema.Types.ObjectId, // Array of User IDs
    // ref: 'User'
    required: true
  }],
  groupImage: {
    type: Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  groupSettingsId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GroupSettings"
  },
  groupChatId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GroupChat"
  },
  communityId: {
    type: Schema.Types.ObjectId,
    default: undefined,
    ref: "CommunityDetails"
  },
});

groupDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

groupDetailsSchema.index({name: "text", description: "text"})

groupDetailsSchema.statics = {
  createGroup : async function(name, description, createdBy, members, admins, groupSettingsId, groupChatId, groupImage){
    const uid = strToObjId(createdBy)
    const newGroup = new this({name, description, createdBy: uid, members, admins, groupSettingsId, groupChatId, groupImage})
    return await newGroup.save()
  },
  getGroup: async function(groupId){
    const gid = strToObjId(groupId)
    const group = await this.findOne({_id: groupId})
    if(!group){
      throw Error("Group specified cannot be found")
    }
    return group
  },
  getGroupWithMembers: async function(groupId) {
    try {
      const gid = strToObjId(groupId)
      const groupDetails = await GroupDetails.aggregate([
        { $match: { _id: gid } },
        {
          $lookup: {
            from: 'groupmembers', // Collection name for GroupMember
            localField: '_id', // Field in GroupDetails
            foreignField: 'groupId', // Field in GroupMember
            as: 'membersDetails', // Output array field for joined members
          }
        },
        {
          $lookup: {
            from: 'users', // If you want to populate user details as well
            localField: 'membersDetails.userId',
            foreignField: '_id',
            as: 'membersDetails.userDetails'
          }
        }
      ]);
  
      return groupDetails[0]; // Return the first document (since groupId is unique)
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  getGroupList: async function(groupIdArr){
    const groupsDetails = await this.find({_id: {$in : groupIdArr}})
    return groupsDetails
  },
  getGroupsNotInACommunity: async function(groupIdArr){
    const groupsDetails = await this.find({_id: {$in : groupIdArr}, communityId: {$exists: false}}, {_id: 1, members: 1})
    return groupsDetails
  }
}

groupDetailsSchema.methods = {
  isMember: function(userId){
    const uid = strToObjId(userId)
    if(this.members.findIndex(id=>id.equals(uid)) >= 0) return true
    return false
  },
  isAdmin : function(userId){
    const uid = strToObjId(userId)
    if(this.admins.findIndex(id=>id.equals(uid)) >= 0) return true
    return false
  },
  isOwner : function(userId){
    const uid = strToObjId(userId)
    if(this.createdBy.equals(uid)) return true
    return false
  },
  addMembers: async function(members){
    // should verify whether the userId is valid
    if(members instanceof Array && members.length > 0){
      // console.log("members : ", members)
      members.forEach(async userId => {
        // console.log("userId : ", userId)
        const uid = strToObjId(userId)
        if(!this.isMember(uid)){
          // console.log("added : ", uid)
          this.members.push(uid)
          await GroupMember.createGroupMember(this._id, userId)
        }
      });
      await this.save();
    }
  },
  removeMembers: async function(members){
    // should verify whether the userId is valid

    const predicate = (memberId)=>{
      for(let i = 0; i < members.length; i++) {
        const uid = strToObjId(members[i])
        if(memberId.equals(uid)){
          return false
        }
      }
      return true
    }

    if(members instanceof Array && members.length > 0){
      this.members = this.members.filter(predicate)
      this.admins = this.admins.filter(predicate)

      await this.save()
    }
  },
  addAdmins: async function(members){
    // should verify whether the userId is valid
    if(members instanceof Array && members.length > 0){
      members.forEach(userId => {
        const uid = strToObjId(userId)
        if(!this.isAdmin(uid)){
          if(!this.isMember(uid)){
            this.members.push(uid)
          }
          this.admins.push(uid)
        }
      });
      await this.save();
    }
  },
  removeAdmins: async function(members){
    // should verify whether the userId is valid

    const predicate = (memberId)=>{
      for(let i = 0; i < members.length; i++) {
        const uid = strToObjId(members[i])
        if(memberId.equals(uid)){
          return false
        }
      }
      return true
    }

    if(members instanceof Array && members.length > 0){
      this.admins = this.admins.filter(predicate)
      await this.save()
    }
  },
  changeName: async function(newName){
    if(newName){
      this.name = newName
    }
    return await this.save()
  },
  changeDescription: async function(newDescription){
    if(newDescription){
      this.description = newDescription
    }
    return await this.save()
  },
  getMembers: function(){
    return this.members
  },
  getAdmins: function(){
    return this.admins
  }
}



const GroupDetails = mongoose.model('GroupDetails', groupDetailsSchema);
module.exports = GroupDetails;