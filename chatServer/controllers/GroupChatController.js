const GroupChat = require("../models/GroupChat/GroupChat")
const GroupDetails = require("../models/GroupChat/GroupDetails")
const GroupSettings = require("../models/GroupChat/GroupSettings")
const mongoose = require("mongoose")
const { strToId, isSameUser } = require("../util/userIdUtil")
const GroupMessage = require("../models/GroupChat/GroupMessages")
const User = require("../models/User")
const GroupMember = require("../models/GroupChat/GroupMember")
const ChatImage = require("../models/ChatImageModel")

async function createGroupController(data, ws, svr){
    const {name, description, members, admins, visibility, permissions, groupImage} = data

    const groupImageObj = await ChatImage.findById(groupImage)
    if(
        !groupImageObj ||
        groupImageObj.userId.toString() !== ws.decodedUser.userId ||
        groupImageObj.groupId !== null || 
        groupImageObj.communityId !== null
    ){
        ws.send(JSON.stringify({error: "Group image file id is invalid"}))
    }

    members.unshift(ws.decodedUser.userId)
    admins.unshift(ws.decodedUser.userId)

    // check privacy settings of each member
    // and send requests through chat if not possible to add directly

    const groupSettings = await GroupSettings.createGroupSettings(visibility, permissions)
    const groupChat = await GroupChat.createGroupChat(ws.decodedUser.userId, `<userId>${ws.decodedUser.userId} Created the group`, "update")
    const newGroup = await GroupDetails.createGroup(name, description, ws.decodedUser.userId, members, admins, groupSettings._id, groupChat._id, groupImageObj._id)
    await GroupMessage.createMessage(newGroup._id, ws.decodedUser.userId, `<userId>${ws.decodedUser.userId} Created the group`, "update")

    groupImageObj.groupId = newGroup._id
    groupImageObj.visibility = visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE"
    await groupImageObj.save()

    // add the group to the user's group list
    // const user = await User.getUserById(ws.decodedUser.userId)
    // await user.addGroup(newGroup._id)
    await User.addGroupsToUsers(members, [newGroup._id])

    // ws.send(JSON.stringify({type: "group-chat", data: newGroup}))
    
    // creating GroupMember docs for each member in the group

    const chat = {
        ...newGroup._doc,
        senderId: ws.decodedUser.userId,
        lastMessage: groupChat.lastMessage,
        lastMessageType: groupChat.lastMessageType,
        unreadMessageCount: 1,
        lastMessageTimestamp: groupChat.lastMessageTimestamp,
        visibility: groupSettings.visibility,
        permissions: groupSettings.permissions
    }

    members.forEach(member=>{
        const groupMember = GroupMember.createGroupMember(newGroup._id, member)
        if(svr.isUserOnline(member)){
            const socket = svr.getSocketOfUser(member)
            socket.send(JSON.stringify({
                type: "group-chat",
                data: chat
            })) 
        }
    })

}

async function addGroupMembersController(data, ws, svr){
    const {groupId, members} = data
    // const group = 
    // const groupSettings = GroupSettings.findOne({groupId})
    // if()

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    // const u = new mongoose.Types.ObjectId(100)
    // console.log(group.isMember(u))
    // console.log(group.isAdmin(u))
    // console.log(group.isOwner(u))

    // console.log(groupSettings.canAddMembers(group, u))
    // console.log(groupSettings.canRemoveMembers(group, u))
    // console.log(groupSettings.canSendMessages(group, u))
    // console.log(groupSettings.canEditGroupInfo(group, u))
    if(groupSettings.canAddMembers(group, userId)){
        await group.addMembers(members)
        const chat = {
            _id: group._id,
            members: group.members
        }
    
        const m = group.getMembers()
        for(let member of m){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
        ws.send(JSON.stringify({type: "group-member-added", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "group-member-cannot-be-added", data: {}}))
    }
}

async function removeGroupMembersController(data, ws, svr){
    const {groupId, members} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    if(groupSettings.canRemoveMembers(group, userId)){
        await group.removeMembers(members)
        const chat = {
            _id: group._id,
            members: group.members
        }
    
        const m = group.getMembers()
        for(let member of m){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
        ws.send(JSON.stringify({type: "group-members-removed", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "group-members-cannot-be-removed", data: {}}))
    }
}

async function addGroupAdminsController(data, ws, svr){
    const {groupId, admins} = data

    let group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    if(groupSettings.canAddAdmins(group, userId)){
        group = await group.addAdmins(admins)
        const chat = {
            _id: group._id,
            admins: group.admins
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
        ws.send(JSON.stringify({type: "group-admins-added", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "group-admins-cannot-be-added", data: {}}))
    }
}

async function removeGroupAdminsController(data, ws, svr){
    const {groupId, admins} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    if(groupSettings.canRemoveAdmins(group, userId)){
        await group.removeAdmins(admins)
        const chat = {
            _id: group._id,
            admins: group.admins
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
        ws.send(JSON.stringify({type: "group-admins-removed", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "group-admins-cannot-be-removed", data: {}}))
    }
}

async function changeGroupNameController(data, ws, svr){
    const {groupId, updatedData} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    console.log("groupSettings.canEditGroupInfo(group, userId) : ", groupSettings.canEditGroupInfo(group, userId))
    console.log("updating group name : ", updatedData)
    if(groupSettings.canEditGroupInfo(group, userId)){
        const updatedGroup = await group.changeName(updatedData.name)
        ws.send(JSON.stringify({type: "group-name-changed", data: {}}))
        const chat = {
            _id: group._id,
            name: updatedGroup.name,
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "group-name-cannot-be-changed", data: {}}))
    }
}

async function changeGroupDescriptionController(data, ws, svr){
    const {groupId, updatedData} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    console.log("new description : ", updatedData)
    if(groupSettings.canEditGroupInfo(group, userId)){
        const updatedGroup = await group.changeDescription(updatedData.description)
        ws.send(JSON.stringify({type: "group-description-changed", data: {}}))
        const chat = {
            _id: group._id,
            description: updatedGroup.description,
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "group-description-cannot-be-changed", data: {}}))
    }
}

async function changeGroupVisibilityController(data, ws, svr){
    const {groupId, updatedData} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    console.log("new visibility : ", updatedData)
    if(group.isOwner(userId)){
        const updatedGroup = await groupSettings.changeVisibility(updatedData.visibility)
        ws.send(JSON.stringify({type: "group-visibility-changed", data: {}}))
        const chat = {
            _id: group._id,
            visibility: updatedGroup.visibility,
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "group-visibility-cannot-be-changed", data: {}}))
    }
}

async function changeGroupPermissionsController(data, ws, svr){
    const {groupId, updatedData} = data

    const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    console.log("new permissions : ", updatedData)
    if(group.isOwner(userId)){
        const updatedGroup = await groupSettings.changePermissions(updatedData)
        ws.send(JSON.stringify({type: "group-visibility-changed", data: {}}))
        const chat = {
            _id: group._id,
            permissions: updatedGroup.permissions,
        }
    
        const members = group.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "group-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "group-visibility-cannot-be-changed", data: {}}))
    }
}

async function sendGroupMessageController(data, ws, svr){
    const {groupId, message, type, fileIds} = data

    // const group = await GroupDetails.findOne({_id: strToId(groupId)})
    const group = await GroupDetails.getGroup(groupId)
    const groupSettings = await GroupSettings.findOne({_id: group.groupSettingsId})
    const userId = ws.decodedUser.userId

    if(groupSettings.canSendMessages(group, userId)){
        const messageObj = await GroupMessage.createMessage(groupId, userId, message, type, fileIds)
        
        // updating the group chat for the new message
        const groupChat = await GroupChat.findChat(group.groupChatId)
        console.log("group chat: ", groupChat)
        groupChat.updateChat(messageObj)

        const members = group.getMembers()

        // updating the unread message count of each user
        // for(let member of members){
        //     if(member === ws.decodedUser.userId){
        //         groupMember = GroupMember.resetUnreadMessageCount(group._id, member)
        //         continue
        //     }else{
        //         groupMember = GroupMember.incrementMessageCount(group._id, member)
        //     }
        // }

        // const chat = {
        //     _id: group._id,
        //     senderId: groupChat.senderId,
        //     lastMessage: groupChat.lastMessage,
        //     lastMessageType: groupChat.lastMessageType,
        //     unreadMessageCount: groupChat.unreadMessageCount,
        //     lastMessageTimestamp: groupChat.lastMessageTimestamp
        // }

        // send message to online members of the group
        console.log("members : ", members)
        for(let member of members){
            console.log("is same user : ", userId, member)
            console.log("is same user : ", !isSameUser(userId, member))

            let groupMember
            if(isSameUser(member, ws.decodedUser.userId)){
                groupMember = await GroupMember.resetUnreadMessageCount(group._id, member)
            }else{
                groupMember = await GroupMember.incrementMessageCount(group._id, member)
            }

            console.log("groupMember.unreadMessageCount: ", groupMember)

            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'message',
                    data: {
                        // sender: userId,
                        chatType: "group",
                        chatId: group._id,
                        message: messageObj,
                        // timestamp: newMessage.timestamp,
                    }
                }))

                // chat.unreadMessageCount = groupMember.unreadMessageCount
                // socket.send(JSON.stringify({
                //     type: "group-chat",
                //     data: chat
                // }))
            }
        }
        ws.send(JSON.stringify({type: "message-sent-group", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "message-cannot-be-sent-group", data: {}}))
    }
}

async function getGroupMessagesController(data, ws, svr){
    const {groupId} = data

    const group = await GroupDetails.getGroup(groupId)
    // console.log("group : ", group)
    const userId = ws.decodedUser.userId
    const msgs = await GroupMessage.getMessages(group._id, userId)

    const groupMember = await GroupMember.resetUnreadMessageCount(group._id, userId)
    const chat = {
        _id: group._id,
        // senderId: groupChat.senderId,
        // lastMessage: groupChat.lastMessage,
        // lastMessageType: groupChat.lastMessageType,
        unreadMessageCount: 0,
        // lastMessageTimestamp: groupChat.lastMessageTimestamp
    }

    // ws.send(JSON.stringify({type: "chatMessages", data: {
    //     chatId: chat._id,
    //     messageList: msgs[0],
    //     unreadMessageList: msgs[1]
    // }}))

    // ws.send(JSON.stringify({type: "group-messages", messages}))

    ws.send(JSON.stringify({
        type: "chatMessages",
        data: {
            chatId: groupId,
            messageList: msgs[0],
            unreadMessageList: msgs[1]
        }
    }))

    // ws.send(JSON.stringify({
    //     type: "group-chat",
    //     data: chat
    // }))
}

async function messageCountResetController(data, ws, svr){
    const {groupId} = data

    const group = await GroupDetails.getGroup(groupId)
    const userId = ws.decodedUser.userId

    const groupMember = await GroupMember.resetUnreadMessageCount(group._id, userId)
    // const chat = {
    //     _id: group._id,
    //     unreadMessageCount: 0,
    // }

    // ws.send(JSON.stringify({
    //     type: "group-chat",
    //     data: chat
    // }))
}

module.exports = {
    createGroupController,
    addGroupMembersController,
    removeGroupMembersController,
    addGroupAdminsController,
    removeGroupAdminsController,
    changeGroupNameController,
    changeGroupDescriptionController,
    changeGroupVisibilityController,
    changeGroupPermissionsController,
    sendGroupMessageController,
    getGroupMessagesController,
    messageCountResetController
}