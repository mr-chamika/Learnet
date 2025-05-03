const File = require("../models/FileModel")
const Link = require("../models/LinkModel")
const Video = require("../models/VideoModel")
const Blog = require("../models/Blog/BlogModel")
const Event = require("../models/Event")
const Note = require("../models/NoteModel")
const { distributeItemsNonEmpty } = require("../utils/RandomDistribution")
const User = require("../models/UserModel")
const GroupDetails = require("../models/GroupDetails")
const { strToObjId } = require("../utils/strToObjId")
const CommunityDetails = require("../models/CommunityDetails")

const getFileFeed = async (req, res) => {
    const {page} = req.body
    const pageSize = 10
    const files = await File.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
    res.json(files)
}

// const getLinkFeed = async (req, res) => {
//     const {page} = req.body
//     const pageSize = 10
//     const links = await Link.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
//     res.json(links)
// }

// const getVideoFeed = async (req, res) => {
//     const {page} = req.body
//     const pageSize = 10
//     const videos = await Video.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
//     res.json(videos)
// }

// const getBlogFeed = async (req, res) => {
//     const {page} = req.body
//     const pageSize = 10
//     const blogs = await Link.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
//     res.json(blogs)
// }

// const getEventFeed = async (req, res) => {
//     const {page} = req.body
//     const pageSize = 10
//     const events = await Link.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
//     res.json(events)
// }

// const getNoteFeed = async (req, res) => {
//     const {page} = req.body
//     const pageSize = 10
//     const notes = await Note.find({visibility: "PUBLIC"}).skip(page * pageSize).limit(pageSize)
//     res.json(notes)
// }

const getRandomFeed = async (req, res) => {
    let {lastIds, includeOnly} = req.body
    const userId = req.user.userId

    const user = await User.findById(userId).select("tags")
    const userTags = user.tags || []; // Array of tags the user is interested in

    // If user has no tags, return empty array or popular public notes
    let filter
    if (userTags.length === 0) {
        filter = { visibility: 'PUBLIC' }
    }else{
        filter = {
            visibility: 'PUBLIC',
            tags: { $in: userTags } // At least one tag must match
        }
    }

    const allModels = {
        files: File,
        links: Link,
        videos: Video,
        notes: Note,
        groups: GroupDetails,
        communities: CommunityDetails
    }

    const pageSize = 10
    // const models = [File, Link, Video, Note]
    // const lables = ["files", "links", "videos", "notes"]
    const models = []
    const lables = []
    Object.keys(includeOnly).forEach(key=>{
        if(includeOnly[key]){
            models.push(allModels[key])
            lables.push(key)
        }
    })
    
    console.log("selected models : ", lables)

    if(!lastIds || lastIds.length === 0){
        lastIds = [null, null, null, null, null, null]
    }

    // console.log("======================== lastIds: ", lastIds)
    const distribution = distributeItemsNonEmpty(models.length, pageSize)
    // console.log("dist: ", distribution)
    const data = {}
    for(let i = 0; i < models.length; i++){
        // if(i >= 2) break
        let docs
        if(lables[i] === "groups" || lables[i] === "communities"){
            const gc = lables[i] === "groups" ? "group" : "community"
            console.log("lastIds[i] : ", lastIds[i])
            const pipeline = [
                // 1. Join with GroupSettings
                {
                    $lookup: {
                        from: `${gc}settings`,
                        localField: `${gc}SettingsId`,
                        foreignField: "_id",
                        as: `${gc}Settings`
                    }
                },
                { $unwind: `$${gc}Settings` },
                
                // 2. Filter public groups
                { $match: { 
                    [`${gc}Settings.visibility`]: "PUBLIC" } },
                
                // 3. Sort by _id descending (newest first)
                { $sort: { _id: -1 } }
            ];
            
            // 4. Add cursor filter ONLY if lastId exists
            if (lastIds[i]) {
                pipeline.push({
                    $match: {
                        _id: { $lt: strToObjId(lastIds[i]) } // Convert string to ObjectId
                    }
                });
            }
            
            // 5. Limit results
            pipeline.push({ $limit: distribution[i] });
        
            docs = await models[i].aggregate(pipeline);
            console.log("groups feed : ", docs)
        }else{
            if(lastIds[i]){
                docs = await models[i].find({
                        // visibility: "PUBLIC",
                        ...filter,
                        _id: { $lt: lastIds[i] }
                    })
                    .sort({ _id : -1 })
                    .limit(distribution[i])
            }else{
                docs = await models[i].find(filter)
                    .sort({ _id : -1 })
                    .limit(distribution[i])
    
            }
        }

        data[lables[i]] = docs
        if(docs.length > 0){
            lastIds[i] = docs[docs.length - 1]._id.toString()
        }
    }

    // console.log("feed : ", data)
    res.json({feed: data, lastIds, distribution})
}

const getSearchBasedFeed = async (req, res) => {
    let {lastIds, includeOnly, search} = req.body
    const userId = req.user.userId

    const user = await User.findById(userId).select("tags")
    const userTags = user.tags || []; // Array of tags the user is interested in

    // If user has no tags, return empty array or popular public notes
    let filter
    if (userTags.length === 0) {
        filter = { visibility: 'PUBLIC' }
    }else{
        filter = {
            visibility: 'PUBLIC',
            tags: { $in: userTags } // At least one tag must match
        }
    }

    const allModels = {
        files: File,
        links: Link,
        videos: Video,
        notes: Note,
        groups: GroupDetails,
        communities: CommunityDetails
    }

    const pageSize = 10
    const models = []
    const lables = []
    Object.keys(includeOnly).forEach(key=>{
        if(includeOnly[key]){
            models.push(allModels[key])
            lables.push(key)
        }
    })

    if(!lastIds || lastIds.length === 0){
        lastIds = [null, null, null, null, null]
    }

    const distribution = distributeItemsNonEmpty(models.length, pageSize)

    console.log("distribution : ", distribution)
    
    const data = {}
    for(let i = 0; i < models.length; i++){
        let docs
        if(lables[i] === "groups" || lables[i] === "communities"){
            const gc = lables[i] === "groups" ? "group" : "community"
            const pipeline = [
                // 1. Join with GroupSettings
                {   $match : {
                        $text: { $search: search }, 
                    }
                },
                {
                    $lookup: {
                        from: `${gc}settings`,
                        localField: `${gc}SettingsId`,
                        foreignField: "_id",
                        as: `${gc}Settings`
                    }
                },
                { $unwind: `$${gc}Settings` },
                
                // // 2. Filter public groups
                { 
                    $match: { 
                        [`${gc}Settings.visibility`]: "PUBLIC"
                    },
                },
                
                // // 3. Sort by _id descending (newest first)
                {
                    $sort: {
                      score: { $meta: "textScore" }, // Sort by text relevance
                      _id: -1                        // Secondary sort for cursor pagination
                    }
                  },
            ];
            
            // 4. Add cursor filter ONLY if lastId exists
            if (lastIds[i]) {
                pipeline.push({
                    $match: {
                        _id: { $lt: strToObjId(lastIds[i]) } // Convert string to ObjectId
                    }
                });
            }
            
            // 5. Limit results
            pipeline.push({ $limit: distribution[i] });
        
            docs = await models[i].aggregate(pipeline);
            // console.log("search group feed : ", docs)
        }else{
            if(lastIds[i]){
                docs = await models[i].find({
                        ...filter,
                        _id: { $lt: lastIds[i] },
                        $text: { $search: search }
                    },{
                        score: { $meta: "textScore" }
                    })
                    .sort({ 
                        score: { $meta: "textScore" },
                        _id : -1
                    })
                    .limit(distribution[i])
            }else{
                docs = await models[i].find({
                        ...filter,
                        $text: { $search: search }
                    },{
                        score: { $meta: "textScore" }
                    })
                    .sort({ 
                        score: { $meta: "textScore" },
                        _id : -1
                    })
                    .limit(distribution[i])
    
            }
        }
        data[lables[i]] = docs
        if(docs.length > 0){
            lastIds[i] = docs[docs.length - 1]._id.toString()
        }
    }
    // const files = await File.find(
    //     { $text: { $search: search } },
    //     { score: { $meta: "textScore" } }  // Adds relevance scoring
    //   ).sort({ score: { $meta: "textScore" } })
    
    // res.json(files)

    res.json({feed: data, lastIds, distribution})
}

// cursor based pagination  

// // First query (get initial 10)
// const firstPage = await db.collection.find()
//   .sort({ _id: -1 })
//   .limit(10);

// // Subsequent query using last _id from previous results
// const nextPage = await db.collection.find({
//   _id: { $lt: lastIdFromFirstPage }
// })
// .sort({ _id: -1 })
// .limit(10);


module.exports = {
    getFileFeed,
    // getLinkFeed,
    // getVideoFeed,
    // getBlogFeed,
    // getEventFeed,
    // getNoteFeed,
    getRandomFeed,
    getSearchBasedFeed
}