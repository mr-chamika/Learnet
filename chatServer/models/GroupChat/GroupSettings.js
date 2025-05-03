const mongoose = require('mongoose');
const { strToId } = require('../../util/userIdUtil');
const Schema = mongoose.Schema;

// Group Settings Schema
const groupSettingsSchema = new Schema({
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
    editGroupInfo: {
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
    groupImage: {
      type: String, // URL or path to group image
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
groupSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

groupSettingsSchema.statics = {
  createGroupSettings: async function(visibility, permissions){
    const newGroupSettings = new this({visibility, permissions})
    return await newGroupSettings.save()
  },
  getGroupSettings: async function(settingsId){
    const gsId = strToId(settingsId)
    return await this.findOne(gsId)
  }
}

function check(groupDetails, userId, groupPermissonValue){
  // console.log("groupDetails.isAdmin(userId) : ", groupDetails.isAdmin(userId))
  switch(groupPermissonValue){
    case "owner-only": return groupDetails.isOwner(userId)
    case "admins-only": return groupDetails.isAdmin(userId)
    case "members-only": return groupDetails.isMember(userId)
    default: throw Error(`Unknown type : ${groupPermissonValue}`)
  }
}

groupSettingsSchema.methods = {
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
	canSendMessages: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.sendMessages)
	},
	canAddMembers: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.addMembers)
	},
	canRemoveMembers: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.removeMembers)
	},
	canAddAdmins: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.addAdmins)
	},
	canRemoveAdmins: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.removeAdmins)
	},
	canEditGroupInfo: function(groupDetails, userId){
		return check(groupDetails, userId, this.permissions.editGroupInfo)
	}
}

const GroupSettings = mongoose.model('GroupSettings', groupSettingsSchema);
module.exports = GroupSettings;
