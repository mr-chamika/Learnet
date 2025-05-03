const CommunityDetails = require("../models/CommunityChat/CommunityDetails")
const CommunitySettings = require("../models/CommunityChat/CommunitySettings")
const mongoose = require("mongoose")
const { strToId, isSameUser } = require("../util/userIdUtil")
const User = require("../models/User")
const GroupSettings = require("../models/GroupChat/GroupSettings")
const GroupChat = require("../models/GroupChat/GroupChat")
const GroupDetails = require("../models/GroupChat/GroupDetails")
const GroupMember = require("../models/GroupChat/GroupMember")
const GroupMessage = require("../models/GroupChat/GroupMessages")
const ChatImage = require("../models/ChatImageModel")

async function createCommunityController(data, ws, svr){
    const {name, description, groups, admins, visibility, permissions, communityImage} = data

    const communityImageObj = await ChatImage.findById(communityImage)
    if(
        !communityImageObj ||
        communityImageObj.userId.toString() !== ws.decodedUser.userId ||
        communityImageObj.groupId !== null || 
        communityImageObj.communityId !== null
    ){
        ws.send(JSON.stringify({error: "Community image file id is invalid"}))
    }

    const members = new Set
    members.add(ws.decodedUser.userId)
    admins.unshift(ws.decodedUser.userId)
    
    const groupsDocNotInCommunity = await GroupDetails.getGroupsNotInACommunity(groups)
    const groupsNotInCommunity = groupsDocNotInCommunity.map(groupDoc=>groupDoc._id)
    
    groupsDocNotInCommunity.forEach(groupDoc=>{
        groupDoc.members.forEach(member=>members.add(member))
    })
    const membersArr = new Array()
    membersArr.push(...members)
    console.log("members arr : ", membersArr)
    
    const announcementsGroupSettings = await GroupSettings.createGroupSettings("PRIVATE", undefined)
    const announcementsGroupChat = await GroupChat.createGroupChat(ws.decodedUser.userId, "Created the group", "text")
    const announcementsGroup = await GroupDetails.createGroup("Announcements", "Announcement group of the community", ws.decodedUser.userId, membersArr, admins, announcementsGroupSettings._id, announcementsGroupChat._id, communityImage)
    membersArr.forEach(member=>{
        const groupMember = GroupMember.createGroupMember(announcementsGroup._id, member)
    })


    const generalGroupSettings = await GroupSettings.createGroupSettings("PRIVATE", {
        addMembers: 'admins-only',
        removeMembers: 'admins-only',
        addAdmins: 'admins-only',
        removeAdmins: 'admins-only',
        editGroupInfo: 'admins-only',
        sendMessages: 'members-only'
    })
    const generalGroupChat = await GroupChat.createGroupChat(ws.decodedUser.userId, "Created the group", "text")
    const generalGroup = await GroupDetails.createGroup("General", "General group of the community", ws.decodedUser.userId, membersArr, admins, generalGroupSettings._id, generalGroupChat._id, communityImage)
    membersArr.forEach(member=>{
        const groupMember = GroupMember.createGroupMember(generalGroup._id, member)
    })

    await User.addGroupsToUsers(membersArr, [announcementsGroup._id, generalGroup._id])

    groupsNotInCommunity.unshift(announcementsGroup._id)
    groupsNotInCommunity.unshift(generalGroup._id)
    // admins.unshift(ws.decodedUser.userId)


    // TODO : Each group the user owns can be directly added
    // and For other groups a request should be send to the owners of the groups

    const communitySettings = await CommunitySettings.createCommunitySettings(visibility, permissions, communityImage)
    const newCommunity = await CommunityDetails.createCommunity(name, description, ws.decodedUser.userId, groupsNotInCommunity, membersArr, admins, communitySettings._id, announcementsGroup._id, generalGroup._id, communityImage)

    // update the community image file
    communityImageObj.communityId = newCommunity._id
    communityImageObj.visibility = visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE"
    await communityImageObj.save()
    // ================================

    // update the communityId of each group added to the community
    for(let group of groupsDocNotInCommunity){
        group.communityId = newCommunity._id
        await group.save()
    }
    // ===========================================================


    // add the community to the user's community list
    // await user.addCommunity(newCommunity._id)
    User.addCommunitiesToUsers(membersArr, [newCommunity._id])
    
    // creating CommunityMember docs for each member in the community
    // members.forEach(member=>{
        //     const communityMember = CommunityMember.createCommunityMember(newCommunity._id, member)
        // })
        
    const user = await User.getUserById(ws.decodedUser.userId)
    console.log("new community : ", newCommunity, announcementsGroup, generalGroup)
    const ansMessageObj = await GroupMessage.createMessage(announcementsGroup._id, ws.decodedUser.userId, "<userId>" + user.userId + " Created the community", "update")
    const genralMessageObj = await GroupMessage.createMessage(generalGroup._id, ws.decodedUser.userId, "This is the general chat of the community", "update")
    for(let member of membersArr){
        if(svr.isUserOnline(member)){
            const socket = svr.getSocketOfUser(member)
            socket.send(JSON.stringify({
                type: 'community-chat',
                data: {
                    ...newCommunity._doc,
                    visibility: communitySettings.visibility,
                    permissions: communitySettings.permissions,
                    otherGroups: []
                }
            }))
        }
    }

    for(let member of membersArr){
        if(svr.isUserOnline(member)){
            const socket = svr.getSocketOfUser(member)
            socket.send(JSON.stringify({
                type: 'group-chat',
                data: {
                    ...announcementsGroupChat._doc,
                    ...announcementsGroup._doc,
                    unreadMessageCount: 1,
                    visibility: announcementsGroupSettings.visibility,
                    permissions: announcementsGroupSettings.permissions
                }
            }))
            socket.send(JSON.stringify({
                type: 'group-chat',
                data: {
                    ...generalGroupChat._doc,
                    ...generalGroup._doc,
                    unreadMessageCount: 1,
                    visibility: generalGroupSettings.visibility,
                    permissions: generalGroupSettings.permissions
                }
            }))
        }
    }

    for(let member of membersArr){
        if(svr.isUserOnline(member)){
            const socket = svr.getSocketOfUser(member)
            socket.send(JSON.stringify({
                type: 'message',
                data: {
                    // sender: userId,
                    chatType: "group",
                    chatId: announcementsGroup._id,
                    message: ansMessageObj,
                    // timestamp: newMessage.timestamp,
                }
            }))
            socket.send(JSON.stringify({
                type: 'message',
                data: {
                    // sender: userId,
                    chatType: "group",
                    chatId: generalGroup._id,
                    message: genralMessageObj,
                    // timestamp: newMessage.timestamp,
                }
            }))
        }
    }
    

    ws.send(JSON.stringify({type: "community-created", data: newCommunity}))
}

async function addCommunityMembersController(data, ws, svr){
    const {communityId, members: membersToAdd} = data
    // const community = 
    // const communitySettings = CommunitySettings.findOne({communityId})
    // if()

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    // const u = new mongoose.Types.ObjectId(100)
    // console.log(community.isMember(u))
    // console.log(community.isAdmin(u))
    // console.log(community.isOwner(u))

    // console.log(communitySettings.canAddMembers(community, u))
    // console.log(communitySettings.canRemoveMembers(community, u))
    // console.log(communitySettings.canSendMessages(community, u))
    // console.log(communitySettings.canEditCommunityInfo(community, u))
    if(communitySettings.canAddMembers(community, userId)){
        await community.addMembers(membersToAdd)

        const members = community.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'community-chat',
                    data: {
                        ...community._doc,
                        visibility: communitySettings.visibility,
                        permissions: communitySettings.permissions
                    }
                }))
            }
        }

        await User.addGroupsToUsers(members, [community.announcementsGroupId, community.generalGroupId])
        await User.addCommunitiesToUsers(members, [community._id])

        console.log("community : ", community)
        ws.send(JSON.stringify({type: "community-member-added", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "community-member-cannot-be-added", data: {}}))
    }
}

async function removeCommunityMembersController(data, ws, svr){
    const {communityId, members: membersToRemove} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    if(communitySettings.canRemoveMembers(community, userId)){
        await community.removeMembers(membersToRemove)

        const members = community.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'community-chat',
                    data: {
                        ...community._doc,
                        visibility: communitySettings.visibility,
                        permissions: communitySettings.permissions
                    }
                }))
            }
        }

        await User.removeGroupsFromUsers(members, [community.announcementsGroupId, community.generalGroupId])
        await User.removeCommunitiesFromUsers(members, [community._id])

        ws.send(JSON.stringify({type: "community-members-removed", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "community-members-cannot-be-removed", data: {}}))
    }
}

async function addCommunityAdminsController(data, ws, svr){
    const {communityId, admins} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    if(communitySettings.canAddAdmins(community, userId)){
        await community.addAdmins(admins)

        const updatedAdmins = community.getAdmins()
        const members = community.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'community-chat',
                    data: {
                        _id: community._id,
                        admins: updatedAdmins
                    }
                }))
            }
        }

        ws.send(JSON.stringify({type: "community-admins-added", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "community-admins-cannot-be-added", data: {}}))
    }
}

async function removeCommunityAdminsController(data, ws, svr){
    const {communityId, admins} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    if(communitySettings.canRemoveAdmins(community, userId)){
        console.log("prev admins : ", community.getAdmins())
        await community.removeAdmins(admins)
        console.log("after admins : ", community.getAdmins())

        const updatedAdmins = community.getAdmins()
        const members = community.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'community-chat',
                    data: {
                        _id: community._id,
                        admins: updatedAdmins
                    }
                }))
            }
        }

        ws.send(JSON.stringify({type: "community-admins-removed", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "community-admins-cannot-be-removed", data: {}}))
    }
}

async function changeCommunityNameController(data, ws, svr){
    const {communityId, updatedData} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    console.log("communitySettings.canEditCommunityInfo(community, userId) : ", communitySettings.canEditCommunityInfo(community, userId))
    console.log("updating community name : ", updatedData)
    if(communitySettings.canEditCommunityInfo(community, userId)){
        const updatedCommunity = await community.changeName(updatedData.name)
        ws.send(JSON.stringify({type: "community-name-changed", data: {}}))
        const chat = {
            _id: community._id,
            name: updatedCommunity.name,
        }
    
        const generalGroup = await GroupDetails.getGroup(community.generalGroupId)
        const members = generalGroup.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "community-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "community-name-cannot-be-changed", data: {}}))
    }
}

async function changeCommunityDescriptionController(data, ws, svr){
    const {communityId, updatedData} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    console.log("new description : ", updatedData)
    if(communitySettings.canEditCommunityInfo(community, userId)){
        const updatedCommunity = await community.changeDescription(updatedData.description)
        ws.send(JSON.stringify({type: "community-description-changed", data: {}}))
        const chat = {
            _id: community._id,
            description: updatedCommunity.description,
        }
    
        const generalGroup = await GroupDetails.getGroup(community.generalGroupId)
        const members = generalGroup.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "community-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "community-description-cannot-be-changed", data: {}}))
    }
}

async function changeCommunityVisibilityController(data, ws, svr){
    const {communityId, updatedData} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    console.log("new visibility : ", updatedData)
    if(community.isOwner(userId)){
        const updatedCommunity = await communitySettings.changeVisibility(updatedData.visibility)
        ws.send(JSON.stringify({type: "community-visibility-changed", data: {}}))
        const chat = {
            _id: community._id,
            visibility: updatedCommunity.visibility,
        }
    
        const generalGroup = await GroupDetails.getGroup(community.generalGroupId)
        const members = generalGroup.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "community-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "community-visibility-cannot-be-changed", data: {}}))
    }
}

async function changeCommunityPermissionsController(data, ws, svr){
    const {communityId, updatedData} = data

    const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    console.log("new permissions : ", updatedData)
    if(community.isOwner(userId)){
        const updatedCommunity = await communitySettings.changePermissions(updatedData)
        ws.send(JSON.stringify({type: "community-visibility-changed", data: {}}))
        const chat = {
            _id: community._id,
            permissions: updatedCommunity.permissions,
        }
    
        const generalGroup = await GroupDetails.getGroup(community.generalGroupId)
        const members = generalGroup.getMembers()
        for(let member of members){
            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: "community-chat",
                    data: chat
                })) 
            }
        }
    }else{
        ws.send(JSON.stringify({type: "community-visibility-cannot-be-changed", data: {}}))
    }
}

async function sendCommunityMessageController(data, ws, svr){
    const {communityId, message, type} = data

    // const community = await CommunityDetails.findOne({_id: strToId(communityId)})
    const community = await CommunityDetails.getCommunity(communityId)
    const communitySettings = await CommunitySettings.findOne({_id: community.communitySettingsId})
    const userId = ws.decodedUser.userId

    if(communitySettings.canSendMessages(community, userId)){
        const messageObj = await CommunityMessage.createMessage(communityId, userId, message, type)
        
        // updating the community chat for the new message
        const communityChat = await CommunityChat.findChat(community.communityChatId)
        console.log("community chat: ", communityChat)
        communityChat.updateChat(messageObj)

        const generalGroup = await GroupDetails.getGroup(community.generalGroupId)
        const members = generalGroup.getMembers()

        // updating the unread message count of each user
        // for(let member of members){
        //     if(member === ws.decodedUser.userId){
        //         communityMember = CommunityMember.resetUnreadMessageCount(community._id, member)
        //         continue
        //     }else{
        //         communityMember = CommunityMember.incrementMessageCount(community._id, member)
        //     }
        // }

        // const chat = {
        //     _id: community._id,
        //     senderId: communityChat.senderId,
        //     lastMessage: communityChat.lastMessage,
        //     lastMessageType: communityChat.lastMessageType,
        //     unreadMessageCount: communityChat.unreadMessageCount,
        //     lastMessageTimestamp: communityChat.lastMessageTimestamp
        // }

        // send message to online members of the community
        console.log("members : ", members)
        for(let member of members){
            console.log("is same user : ", userId, member)
            console.log("is same user : ", !isSameUser(userId, member))

            let communityMember
            if(isSameUser(member, ws.decodedUser.userId)){
                communityMember = await CommunityMember.resetUnreadMessageCount(community._id, member)
            }else{
                communityMember = await CommunityMember.incrementMessageCount(community._id, member)
            }

            console.log("communityMember.unreadMessageCount: ", communityMember)

            if(svr.isUserOnline(member)){
                const socket = svr.getSocketOfUser(member)
                socket.send(JSON.stringify({
                    type: 'message',
                    data: {
                        // sender: userId,
                        chatType: "community",
                        chatId: community._id,
                        message: messageObj,
                        // timestamp: newMessage.timestamp,
                    }
                }))

                // chat.unreadMessageCount = communityMember.unreadMessageCount
                // socket.send(JSON.stringify({
                //     type: "community-chat",
                //     data: chat
                // }))
            }
        }
        ws.send(JSON.stringify({type: "message-sent-community", data: {}}))
    }else{
        ws.send(JSON.stringify({type: "message-cannot-be-sent-community", data: {}}))
    }
}

async function getCommunityMessagesController(data, ws, svr){
    const {communityId} = data

    const community = await CommunityDetails.getCommunity(communityId)
    // console.log("community : ", community)
    const userId = ws.decodedUser.userId
    const msgs = await CommunityMessage.getMessages(community._id, userId)

    const communityMember = await CommunityMember.resetUnreadMessageCount(community._id, userId)
    const chat = {
        _id: community._id,
        // senderId: communityChat.senderId,
        // lastMessage: communityChat.lastMessage,
        // lastMessageType: communityChat.lastMessageType,
        unreadMessageCount: 0,
        // lastMessageTimestamp: communityChat.lastMessageTimestamp
    }

    // ws.send(JSON.stringify({type: "chatMessages", data: {
    //     chatId: chat._id,
    //     messageList: msgs[0],
    //     unreadMessageList: msgs[1]
    // }}))

    // ws.send(JSON.stringify({type: "community-messages", messages}))

    ws.send(JSON.stringify({
        type: "chatMessages",
        data: {
            chatId: communityId,
            messageList: msgs[0],
            unreadMessageList: msgs[1]
        }
    }))

    // ws.send(JSON.stringify({
    //     type: "community-chat",
    //     data: chat
    // }))
}

async function messageCountResetController(data, ws, svr){
    const {communityId} = data

    const community = await CommunityDetails.getCommunity(communityId)
    const userId = ws.decodedUser.userId

    const communityMember = await CommunityMember.resetUnreadMessageCount(community._id, userId)
    // const chat = {
    //     _id: community._id,
    //     unreadMessageCount: 0,
    // }

    // ws.send(JSON.stringify({
    //     type: "community-chat",
    //     data: chat
    // }))
}

module.exports = {
    createCommunityController,
    addCommunityMembersController,
    removeCommunityMembersController,
    addCommunityAdminsController,
    removeCommunityAdminsController,
    changeCommunityNameController,
    changeCommunityDescriptionController,
    changeCommunityVisibilityController,
    changeCommunityPermissionsController,
}