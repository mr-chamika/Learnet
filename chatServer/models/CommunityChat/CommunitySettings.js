const mongoose = require('mongoose');
const { strToId } = require('../../util/userIdUtil');
const Schema = mongoose.Schema;

// Community Settings Schema
const communitySettingsSchema = new Schema({
  visibility: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PRIVATE'
  },
//   admins: [{
//     type: Schema.Types.ObjectId,
//     // ref: 'User'
//   }],
  permissions: {
    addMembers: {
        type: String,
      enum: ['owner-only', 'admins-only', 'members-only'],
      default: 'admins-only'
    },
    removeMembers: {
        type: String,
      enum: ['owner-only', 'admins-only'],
      default: 'admins-only'
    },
    addAdmins: {
        type: String,
      enum: ['owner-only', 'admins-only'],
      default: 'admins-only'
    },
    removeAdmins: {
        type: String,
      enum: ['owner-only', 'admins-only'],
      default: 'admins-only'
    },
    editCommunityInfo: {
        type: String,
      enum: ['owner-only', 'admins-only', 'members-only'],
      default: 'admins-only'
    },
    sendMessages: {
        type: String,
      enum: ['owner-only', 'admins-only', 'members-only'],
      default:'admins-only'
    }
  },
  notifications: {
    enableNotifications: {
      type: Boolean,
      default: true
    },
    muteDuration: {
      type: Number, // Duration in minutes; 0 = unmuted
      default: 0
    }
  },
  customizations: {
    communityImage: {
      type: String, // URL or path to community image
      default: ''
    },
    themeColor: {
      type: String, // e.g., "#ffffff"
      default: '#ffffff'
    }
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
communitySettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

communitySettingsSchema.statics = {
  createCommunitySettings: async function(visibility, permissions){
    const newCommunitySettings = new this({visibility, permissions})
    return await newCommunitySettings.save()
  },
  getCommunitySettings: async function(settingsId){
    const csId = strToId(settingsId)
    return await this.findOne(csId)
  }
}

function check(communityDetails, userId, communityPermissonValue){
  // console.log("communityDetails.isAdmin(userId) : ", communityDetails.isAdmin(userId))
  switch(communityPermissonValue){
    case "owner-only": return communityDetails.isOwner(userId)
    case "admins-only": return communityDetails.isAdmin(userId)
    case "members-only": return communityDetails.isMember(userId)
    default: throw Error(`Unknown type : ${communityPermissonValue}`)
  }
}

communitySettingsSchema.methods = {
	changeVisibility: async function(newVisibility){
		console.log("cur visibility : ", this.visibility)
		if(newVisibility){
			this.visibility = newVisibility
		}
		return await this.save()
	},
	changePermissions: async function(newPermissions){
		console.log("cur visibility : ", this.visibility)
		if(newPermissions){
			this.permissions = {...newPermissions}
		}
		return await this.save()
	},
	canSendMessages: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.sendMessages)
	},
	canAddMembers: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.addMembers)
	},
	canRemoveMembers: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.removeMembers)
	},
	canAddAdmins: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.addAdmins)
	},
	canRemoveAdmins: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.removeAdmins)
	},
	canEditCommunityInfo: function(communityDetails, userId){
		return check(communityDetails, userId, this.permissions.editCommunityInfo)
	}
}

const CommunitySettings = mongoose.model('CommunitySettings', communitySettingsSchema);
module.exports = CommunitySettings;
