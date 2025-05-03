const UserFriends = require("../models/UserFriendsModel");
const User = require("../models/UserModel")

async function getUserFriends(req, res){
    const userId = req.user.userId
    const user = await User.findById(userId)
    const userFriends = await UserFriends.findById(user.friendsId)
    res.json(userFriends)
}

async function getFriendList(req, res){
    // check privacy settings
    const userId = req.body.userId
    const user = await User.findById(userId)
    const userFriends = await UserFriends.findById(user.friendsId)
    res.json({friends: userFriends.friends})
}

// Send a friend request
async function sendFriendRequest(req, res){
    const senderId = req.user.userId; // Assuming authentication middleware adds user ID
    const receiverId = req.body.id;

    if (senderId === receiverId) {
        return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId);
    
    if (!receiver) {
        return res.status(404).json({ message: "User not found" });
    }
    
    const senderFriends = await UserFriends.findById(sender.friendsId)
    const receiverFriends = await UserFriends.findById(receiver.friendsId)

    if (senderFriends.friends.includes(receiverId)) {
        return res.status(400).json({ message: "User is already your friend" });
    }

    if (receiverFriends.friendRequestsReceived.includes(senderId) || senderFriends.friendRequestsSent.includes(receiverId)) {
        return res.status(400).json({ message: "Friend request already sent." });
    }

    receiverFriends.friendRequestsReceived.push(senderId);
    senderFriends.friendRequestsSent.push(receiverId);

    await senderFriends.save();
    await receiverFriends.save();

    res.status(200).json({ message: "Friend request sent successfully" });
};

async function cancelFriendRequest(req, res){
    const senderId = req.user.userId; // Assuming authentication middleware adds user ID
    const receiverId = req.body.id;

    if (senderId === receiverId) {
        return res.status(400).json({ message: "Invalid request." });
    }

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId);
    
    if (!receiver) {
        return res.status(404).json({ message: "User not found" });
    }
    
    const senderFriends = await UserFriends.findById(sender.friendsId)
    const receiverFriends = await UserFriends.findById(receiver.friendsId)

    if (senderFriends.friends.includes(receiverId)) {
        return res.status(400).json({ message: "User is already your friend" });
    }

    if (!receiverFriends.friendRequestsReceived.includes(senderId) && !senderFriends.friendRequestsSent.includes(receiverId)) {
        return res.status(400).json({ message: "Friend request already sent." });
    }

    receiverFriends.friendRequestsReceived = receiverFriends.friendRequestsReceived.filter(id => id.toString() !== senderId.toString());
    senderFriends.friendRequestsSent = senderFriends.friendRequestsSent.filter(id => id.toString() !== receiverId.toString());

    await senderFriends.save();
    await receiverFriends.save();

    res.status(200).json({ message: "Friend request canceled successfully" });
};


async function acceptFriendRequest(req, res){
    const receiverId = req.user.userId;
    const senderId = req.body.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!sender) {
        return res.status(404).json({ message: "User not found" });
    }

    const senderFriends = await UserFriends.findById(sender.friendsId)
    const receiverFriends = await UserFriends.findById(receiver.friendsId)

    if (!receiverFriends.friendRequestsReceived.includes(senderId)) {
        return res.status(400).json({ message: "No friend request from this user" });
    }

    if (receiverFriends.friends.length >= 500) {
        return res.status(400).json({ message: "Friend limit reached (500 friends max). Cannot accept more friends." });
    }

    receiverFriends.friends.push(senderId);
    senderFriends.friends.push(receiverId);

    receiverFriends.friendRequestsReceived = receiverFriends.friendRequestsReceived.filter(id => id.toString() !== senderId.toString());
    senderFriends.friendRequestsSent = senderFriends.friendRequestsSent.filter(id => id.toString() !== receiverId.toString());

    await receiverFriends.save();
    await senderFriends.save();

    res.status(200).json({ message: "Friend request accepted" });
};

async function rejectRequest(req, res){
    const receiverId = req.user.userId;
    const senderId = req.body.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!sender) {
        return res.status(404).json({ message: "User not found" });
    }

    const senderFriends = await UserFriends.findById(sender.friendsId)
    const receiverFriends = await UserFriends.findById(receiver.friendsId)

    if (!receiverFriends.friendRequestsReceived.includes(senderId)) {
        return res.status(400).json({ message: "No friend request from this user." });
    }

    // Remove request from lists
    receiverFriends.friendRequestsReceived = receiverFriends.friendRequestsReceived.filter(id => id.toString() !== senderId.toString());
    senderFriends.friendRequestsSent = senderFriends.friendRequestsSent.filter(id => id.toString() !== receiverId.toString());

    await receiverFriends.save();
    await senderFriends.save();

    res.status(200).json({ message: "Friend request declined." });
};


const removeFriend = async (req, res) => {
    const userId = req.user.userId
    const { friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
        return res.status(404).json({ message: "User not found." });
    }

    const userFriends = await UserFriends.findById(user.friendsId)
    const friendFriends = await UserFriends.findById(friend.friendsId)

    userFriends.friends = userFriends.friends.filter(id => id.toString() !== friendId);
    friendFriends.friends = friendFriends.friends.filter(id => id.toString() !== userId);

    await userFriends.save();
    await friendFriends.save();

    res.status(200).json({ message: "Friend removed." });
};


async function getFriendSuggestions(req, res){
    const page = 1;  // Default to page 1
    const limit = 10;  // Retrieve 10 suggestions per request
    const skip = (page - 1) * limit;  // Calculate how many to skip


    const user = await User.findById(req.user.userId)
    const userId = req.user.userId
    const friendsId = user.friendsId;

    const userFriends = await UserFriends.findById(friendsId)

    console.log("friends id : ", friendsId)
    // const userFriends = await UserFriends.findById(friendsId).populate("friends");

    // if (!userFriends) {
    //     return res.status(404).json({ message: "User not found" });
    // }

    // const friendIds = userFriends.friends.map(friend => friend._id);
    
    // const suggestions = await User.find({
    //     $and: [
    //         { _id: { $ne: userId } }, // Exclude current user
    //         { _id: { $nin: friendIds } }, // Exclude friends
    //         {
    //             $or: [
    //                 { university: user.university }, // Same university
    //                 { tags: { $in: user.tags } }, // Common tags
    //                 { friends: { $in: friendIds } } // Friends of friends
    //             ]
    //         }
    //     ]
    // })
    // .select("name username university tags profilePicturePath")
    // .limit(limit)  // Restrict number of results per request
    // .skip(skip);   // Skip records for pagination

    const suggestions = await UserFriends.aggregate([
        // Step 1: Find the user's friends
        {
            $match: { _id: friendsId } // Match the UserFriends document for the given friendsId
        },
        {
            $project: {
                _id: 0,
                friends: 1 // Keep only the 'friends' array from the UserFriends document
            }
        },
        // {
        //     $lookup: {
        //         from: "users", // Join with User collection
        //         localField: "friends", // Use the 'friends' array from UserFriends
        //         foreignField: "_id", // Match with _id field in User collection
        //         as: "friendData" // Store result as 'friendData'
        //     }
        // },
        // {
        //     $project: {
        //         friendIds: "$friendData.friendsId" // Extract the friend IDs from the joined data
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "userfriends", // Join with User collection
        //         localField: "friendIds", // Use the 'friends' array from UserFriends
        //         foreignField: "_id", // Match with _id field in User collection
        //         as: "nestedFriendsData" // Store result as 'friendData'
        //     }
        // },
        // {
        //     $project: {
        //         nestedFriends: { $reduce: {
        //             input: "$nestedFriendsData.friends", // Input: array of arrays from previous stage
        //             initialValue: [], // Initial value for the reduction
        //             in: { $concatArrays: ["$$value", "$$this"] } // Flatten the array of arrays
        //         }}
        //     }
        // },
    
        // Step 2: Find suggested users based on conditions
        {
            $lookup: {
                from: "users", // Join with the Users collection
                pipeline: [
                    {
                        $match: {
                            _id: { $ne: userId }, // Exclude the current user (friendsId)
                            $and: [
                                // { _id: { $nin: "$nestedFriends" } }, // Exclude users already in the friends list or their friends
                                {
                                    $or: [
                                        { university: user.university }, // Same university
                                        { tags: { $in: user.tags } }, // Common tags
                                        // { _id: { $in: "$nestedFriends" } } // Friend of a friend (from nestedFriends)
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            username: 1,
                            university: 1,
                            tags: 1,
                            profilePicturePath: 1
                        }
                    },
                    // { $skip: skip },  // Skip records for pagination
                    // { $limit: limit }  // Limit the number of results per request
                ],
                as: "suggestions" // Store results as 'suggestions'
            }
        },
    
        // {
        //     $unwind: "$suggestions" // Convert array to object list
        // },
        // {
        //     $replaceRoot: { newRoot: "$suggestions" } // Flatten structure, make 'suggestions' the root
        // }
    ]);

    let suggestions2
    // if(!suggestions || suggestions.length < 10){
        suggestions2 = await User.find({
            university: {$ne: user.university},
            _id: {$nin: [
                ...userFriends.friends,
                ...userFriends.friendRequestsReceived,
                ...userFriends.friendRequestsSent
            ]}
        },
        {
            _id: 1
        })
        // .limit(10)
    // }
    
    suggestions2 = suggestions2.map(v=>v._id)

    res.status(200).json([...suggestions2]);
};

module.exports ={
    getUserFriends,
    getFriendList,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectRequest,
    removeFriend,
    getFriendSuggestions
}
