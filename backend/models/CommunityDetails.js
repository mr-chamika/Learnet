const mongoose = require('mongoose');
const { strToObjId } = require('../utils/strToObjId');
const Schema = mongoose.Schema;

// Community Schema
const communityDetailsSchema = new Schema({
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
    type: Schema.Types.ObjectId, // User who created the community
    // ref: 'User',
    required: true
  },
  groups: [{ // groups belong to the community
    type: Schema.Types.ObjectId, 
    // ref: 'User'
    required: true
  }],
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
  communityImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  communitySettingsId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CommunitySettings"
  },
  announcementsGroupId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GroupDetails"
  },
  generalGroupId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GroupDetails"
  },
  communityChatId: {
    type: Schema.Types.ObjectId,
    required: true
  },
});

communityDetailsSchema.index({name : 'text', description: 'text'})

communityDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

communityDetailsSchema.statics = {
  createCommunity : async function(name, description, createdBy, groups, members, admins, communitySettingsId, announcementsGroupId, generalGroupId, communityChatId){
    const uid = strToObjId(createdBy)
    const newCommunity = new this({name, description, createdBy: uid, groups, members, admins, communitySettingsId, announcementsGroupId, generalGroupId, communityChatId})
    return await newCommunity.save()
  },
  getCommunity: async function(communityId){
    const cid = strToObjId(communityId)
    const community = await this.findOne({_id: cid})
    if(!community){
      throw Error("Community specified cannot be found")
    }
    return community
  },
  getCommunityList: async function(communityIdArr){
    const communityDetails = await this.find({_id: {$in : communityIdArr}})
    return communityDetails
  }
}

communityDetailsSchema.methods = {
//   isMember: function(userId){
//     const uid = strToObjId(userId)
//     if(this.members.findIndex(id=>id.equals(uid)) >= 0) return true
//     return false
//   },
  isMember : function(userId){
    const uid = strToId(userId)
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
        }
      });
      await this.save();
    }
  },
  removeMembers: async function(members){
    // should verify whether the userId is valid
    if(members instanceof Array && members.length > 0){
      const memberIdsToRemove = members.map(v=>strToObjId(v))
      const predicate = (memberId)=>{
        for(let i = 0; i < memberIdsToRemove.length; i++) {
          if(memberId.equals(memberIdsToRemove[i])){
            return false
          }
        }
        return true
      }

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



const CommunityDetails = mongoose.model('CommunityDetails', communityDetailsSchema);
module.exports = CommunityDetails;