const WebSocketServer = require("./lib/SocketFramework")
const mongoose = require('mongoose');

const { authenticateUser } = require("./controllers/UserController");
const { messageSendRequestController, messagesGetRequestController, messageCountResetController, createPrivateChatController } = require("./controllers/IndividualChatController");
const { createGroupController, addGroupMembersController, removeGroupMembersController, removeGroupAdminsController, addGroupAdminsController, changeGroupNameController, changeGroupDescriptionController, sendGroupMessageController, getGroupMessagesController, messageCountResetController: groupMessageCountResetController, changeGroupVisibilityController, changeGroupPermissionsController } = require("./controllers/GroupChatController");
const { createCommunityController, changeCommunityNameController, addCommunityMembersController, removeCommunityMembersController, addCommunityAdminsController, removeCommunityAdminsController, changeCommunityDescriptionController, changeCommunityVisibilityController, changeCommunityPermissionsController } = require("./controllers/CommunityChatController");

// MongoDB connection (ensure you have MongoDB running)
mongoose.connect('mongodb://localhost:27017/Learnet');
// -----------------------------------------------------------------

const server = new WebSocketServer(false, "./cert/server.crt", "./cert/server.key")

server.addHandler("token", authenticateUser)

server.addHandler("create-chat", createPrivateChatController)
server.addHandler("message", messageSendRequestController)
server.addHandler("chat", messagesGetRequestController)
server.addHandler("message-received", messageCountResetController)

server.addHandler("create-group", createGroupController)
server.addHandler("add-group-members", addGroupMembersController)
server.addHandler("remove-group-members", removeGroupMembersController)
server.addHandler("add-group-admins", addGroupAdminsController)
server.addHandler("remove-group-admins", removeGroupAdminsController)
server.addHandler("change-group-name", changeGroupNameController)
server.addHandler("change-group-description", changeGroupDescriptionController)
server.addHandler("change-group-visibility", changeGroupVisibilityController)
server.addHandler("change-group-permissions", changeGroupPermissionsController)
server.addHandler("send-group-message", sendGroupMessageController)
server.addHandler("get-group-message", getGroupMessagesController)
server.addHandler("group-message-received", groupMessageCountResetController)

server.addHandler("create-community", createCommunityController)
server.addHandler("add-community-members", addCommunityMembersController)
server.addHandler("remove-community-members", removeCommunityMembersController)
server.addHandler("add-community-admins", addCommunityAdminsController)
server.addHandler("remove-community-admins", removeCommunityAdminsController)
server.addHandler("change-community-name", changeCommunityNameController)
server.addHandler("change-community-description", changeCommunityDescriptionController)
server.addHandler("change-community-visibility", changeCommunityVisibilityController)
server.addHandler("change-community-permissions", changeCommunityPermissionsController)

server.listen()