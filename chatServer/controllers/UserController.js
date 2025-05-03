const jwt = require('jsonwebtoken');
const Chat = require("../models/IndChat/Chat");
const User = require('../models/User');
const GroupDetails = require('../models/GroupChat/GroupDetails');
const GroupChat = require('../models/GroupChat/GroupChat');
const GroupMember = require('../models/GroupChat/GroupMember');
const GroupSettings = require('../models/GroupChat/GroupSettings');
const CommunityDetails = require('../models/CommunityChat/CommunityDetails');
const CommunitySettings = require('../models/CommunityChat/CommunitySettings');

const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';

async function authenticateUser(data, ws, svr){
    const token = data

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
            ws.close();
            console.log('JWT Verification Error:', err);
        } else {
            // Store the user email and ws in onlineUsers map
            ws.decodedUser = decoded; // Save decoded user for future messages
            svr.setSocketOfUser(decoded.userId, ws)
            ws.isAuthenticated = true; // Set authentication flag
            console.log(`${decoded.userId} ${decoded.email} is now online`);

            // Send a confirmation message to the client that the user is authenticated
            ws.send(JSON.stringify({ type: 'success', message: 'Authentication successful' }));

            let user = await User.getUserById(decoded.userId)
            if(!user){
                user = await User.createUser(decoded.userId)
            }

            // Deliver any unread messages
            const chatList = await Chat.getChatList(decoded.userId)
            const groupChatList = []
            
            // const unreadMessages = await Message.find({ userId2: decoded.userId, isRead: false });
            // unreadMessages.forEach(async (message) => {
            //     ws.send(
            //     //   JSON.stringify({
            //     //     type: 'message',
            //     //     sender: message.sender,
            //     //     content: message.content,
            //     //     timestamp: message.timestamp,
            //     //   })
            //         JSON.stringify(message)
            //     );
            //     message.isRead = true; // Mark as read
            //     await message.save();
            // });

            ws.send(JSON.stringify({
            type: "ChatList",
            data: chatList
            }))

            // const groupIds = await User.getUserGroups(decoded.userId)
            // console.log("groupIds: ", groupIds)
            const groupList = await GroupDetails.getGroupList(user.groups)
            const groupListModified = []
            const length = groupList.length

            // console.log("grou list : ", groupList[0])
            for(let i = 0; i < length; i++){
                const groupChat = await GroupChat.findChat(groupList[i].groupChatId)
                const groupSettings = await GroupSettings.getGroupSettings(groupList[i].groupSettingsId)
                // console.log("user Id : ", ws.decodedUser.userId)
                const groupMember = await GroupMember.getGroupMember(groupList[i]._id, ws.decodedUser.userId)
                // console.log("group chat : ", groupChat)
                // console.log("group member : ", groupMember)
                groupListModified[i] = {
                    ...groupList[i]._doc, 
                    senderId: groupChat.senderId,
                    lastMessage: groupChat.lastMessage,
                    lastMessageType: groupChat.lastMessageType,
                    unreadMessageCount: groupMember.unreadMessageCount,
                    lastMessageTimestamp: groupChat.lastMessageTimestamp,
                    visibility: groupSettings.visibility,
                    permissions: groupSettings.permissions
                }
            }
            // console.log("groupList: ", groupList)

            ws.send(JSON.stringify({
                type: "GroupList",
                data: groupListModified
            }))


            const communityList = await CommunityDetails.getCommunityList(user.communities)
            const communityListModified = []
            const clength = communityList.length

            // console.log("grou list : ", communityList[0])
            for(let i = 0; i < clength; i++){
                const groupSettings = await CommunitySettings.getCommunitySettings(communityList[i].communitySettingsId)
                const groupsNotIn = communityList[i].groups.filter(group=>!user.groups.find(g => g._id.toString() === group._id.toString()))
                // groupsNotIn - list of groups in the community the user could join
                const groupsNotInData = []
                for(let groupId of groupsNotIn){
                    const group = await GroupDetails.findById(groupId)
                    groupsNotInData.push({
                        _id: group._id,
                        name: group.name,
                        description: group.description,
                        createdAt: group.createdAt,
                        createdBy: group.createdBy,
                        groupImage: group.groupImage,
                        type: "group",
                        updatedAt: group.updatedAt,
                        visibility: group.visibility,
                        requestToJoin: true
                    })
                }
                communityListModified[i] = {
                    ...communityList[i]._doc, 
                    visibility: groupSettings.visibility,
                    permissions: groupSettings.permissions,
                    otherGroups: groupsNotInData
                }
            }
            // console.log("communityList: ", communityList)

            ws.send(JSON.stringify({
                type: "CommunityList",
                data: communityListModified
            }))
        }
    });
}

module.exports = {authenticateUser}