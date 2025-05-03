const User = require("../models/UserModel")

// To search for documents containing a specific phrase in MongoDB, 
// you can use the $text index or the $regex operator, depending on 
// your requirements.

// 1. Using a Full-Text Search ($text Index) - Recommended for Performance
// MongoDB provides a text index that allows efficient searching for words and phrases.

// Steps:
// Create a text index on the contentBody field (if not already indexed):

// db.blogs.createIndex({ contentBody: "text" });
// Search for blogs containing a phrase:

// db.blogs.find({ $text: { $search: "some phrase" } });
// Search for an exact phrase (surround with double quotes):

// db.blogs.find({ $text: { $search: "\"some phrase\"" } });
// Search and sort by relevance:

// db.blogs.find(
//     { $text: { $search: "some phrase" } },
//     { score: { $meta: "textScore" } }
// ).sort({ score: { $meta: "textScore" } });
// Pros: Fast and optimized for text searches.
// Cons: Requires a text index, does not support wildcard searches.

// 2. Using $regex for Partial and Case-Insensitive Searches
// If you need more flexibility (like wildcard matching), use the $regex operator.

// Example Query:
// db.blogs.find({ contentBody: { $regex: "some phrase", $options: "i" } });
// The "i" flag makes the search case-insensitive.
// This will match "Some Phrase", "some phrase", "SOME phrase", etc.
// Pros: More flexible, works without an index.
// Cons: Slower, as it does a full scan of the documents.

// Which One to Use?
// Use $text for indexed, efficient searches.
// Use $regex for flexible, pattern-based searches but avoid it on large datasets due to performance issues.

async function getUserProfilePictureAMController(req, res){
    const {userId} = req.body
    const user = await User.getUserById(userId)
    res.sendFile(user.profilePicturePath)
}

async function getUserAMController(req, res){
    const {userId, email} = req.body

    // TODO : limit the details what others could see on a user based on the user's privacy settings
    let user
    if(userId){
        user = await User.getUserById(userId)
    }else if(email){
        user = await User.getUser(email)
    }
    res.json(user)
}

async function getUsersAMController(req, res){
    const {page} = req.body
    const pageSize = 5
    const skip = page * pageSize
    const users = await User.find({}).skip(skip).limit(pageSize)
    res.json(users)
}

async function suspendUserAMController(req, res){
    const {userId} = req.body
    const info = await User.updateOne({_id: userId}, {isSuspended: true})
    // console.log(info)
    if(info.modifiedCount === 1){
        res.json({message: "User suspended"})
    }else if(info.matchedCount === 0){
        res.json({error: "No user account cannot be found"})
    }else{
        res.json({error: "User account cannot be suspended"})
    }
}

async function activateUserAMController(req, res){
    const {userId} = req.body
    const info = await User.updateOne({_id: userId}, {isSuspended: false})
    if(info.modifiedCount === 1){
        res.json({message: "User account reactivated"})
    }else if(info.matchedCount === 0){
        res.json({error: "No user account cannot be found"})
    }else{
        res.json({error: "User account cannot be reactivated"})
    }
}

async function searchUsersAMController(req, res){
    const searchQuery = req.body.search || "";
    // const users = await User.find(
    //     { $text: { $search: searchQuery } },
    //     { score: { $meta: "textScore" } }
    //     ).sort({ score: { $meta: "textScore" } }).limit(10).toArray();
    // res.json(users)

    console.log("search : ", searchQuery)

    const page = req.body.page
    let limit = req.body.limit > 100 ? 100 : req.body.limit

    const skip = page * limit; 

    const users = await User.find(
        { $text: { $search: searchQuery } }, // Full-text search
        { score: { $meta: "textScore" } }  // Include relevance score
    )
    .sort({ score: { $meta: "textScore" } }) // Sort by relevance
    // const users = await User.find({
    //     $or: [
    //         {name: { $regex: searchQuery }}, // Full-text search
    //         {username: { $regex: searchQuery }}, // Full-text search
    //         {email: { $regex: searchQuery }}, // Full-text search
    //         {bio: { $regex: searchQuery }}, // Full-text search
    //     ]
    // }
    // )
    // const users = await User.find(
    //     {autocomplete: {email: { $regex: searchQuery }}}, // Full-text search
    // )
    .skip(skip) // Skip documents for pagination
    .limit(limit) // Limit the number of documents
    // .explain("executionStats")
    .exec(); 

    // console.log(`Query Execution Time: ${users.executionStats.executionTimeMillis} ms`);
    // console.log("search results : ", JSON.stringify(users))

    res.json(users)
}

module.exports = {
    getUserProfilePictureAMController,
    getUserAMController,
    getUsersAMController,
    suspendUserAMController,
    activateUserAMController,
    searchUsersAMController
}


// Problem: Regex searches ($regex) without an anchored prefix (^) cannot use indexes efficiently.
// Solution:
// Ensure queries start with a fixed prefix (e.g., ^searchTerm) to utilize indexes.
// Create an index on the fields used in the search.

// Instead of using regex, MongoDB’s full-text search ($text) is much faster because it uses an inverted index.
// Downside: This only works for whole words, so partial matches won't work.

// If your system needs fuzzy search (e.g., searching "Joh" should return "John"), consider a search service like Elasticsearch. But for MongoDB, a simple trick is to store "autocomplete" variations in a separate indexed field.

// Example:

// Store: "john", "john d", "john doe"
// Query: "john d"

// await User.createIndex({ autocomplete: 1 });

// const users = await User.find({
//     autocomplete: { $regex: `^${searchQuery}`, $options: "i" }
// })
// .limit(limit)
// .skip(skip);
