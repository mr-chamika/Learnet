const mongoose = require("mongoose")
const { strToId } = require("../../chatServer/util/userIdUtil")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, "Name should contain only letters and spaces"],
        minlength: 10,
        maxlength: 50,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, underscores"],
        minlength: 5,
        maxlength: 20,
    },
    bio: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9\s.,'"-]+$/, "Bio should contain only letters, numbers, spaces, and basic punctuation (.,'-) with max length of 100 characters"],
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        // match: [
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     "Password must be at least 8 and at most 32 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
        // ],
        // maxlength: 32
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address",
        ],
    },
    university: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9\s]+$/, "University name should only contain letters, numbers, and spaces"],
        minlength: 3,
        maxlength: 50,
    },
    uid: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+$/,
            "Please enter a valid university ID number",
        ],
        minlength: 3,
        maxlength: 50,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isModerator: {
        type: Boolean,
        default: false
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'moderator', 'admin'],
    //     default: 'user'
    // },
    reputation: {
        numberOfReportsCreated: { type: Number, default: 0 },
        numberOfFalseReports: { type: Number, default: 0 },
        reputationScore: { type: Number, default: 0 } // Calculated field
    },
    // moderatedReports: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Report'
    // }],
    // submittedReports: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Report'
    // }],
    isSuspended: {
        type: Boolean,
        default: false
    },
    uidImagePath: {
        type: String,
        required: true
    },
    profilePicturePath: {
        type: String,
        required: true
    },
    tags: [{ type: String }], // Interests chosen by the user
    friendsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserFriends"
    }
}, { timestamps: true });

UserSchema.index({ university: 1 });
UserSchema.index({ tags: 1 });
UserSchema.index({ email: "text", name: "text", username: "text", university: "text", bio: "text" });

// A strong password should typically meet the following criteria:
// At least 8 characters long
// Contains at least one uppercase letter (A-Z)
// Contains at least one lowercase letter (a-z)
// Contains at least one digit (0-9)
// Contains at least one special character (!@#$%^&*()_+ etc.)



UserSchema.statics = {
    getUser: async function (email) {
        const user = await this.findOne({ email })
        if (!user) {
            throw Error("User account for the provided email cannot be found")
        }
        return user
    },
    getUserByEmail: async function (email) {
        const user = await this.findOne({ email }, { password: 0, emailVerified: 0, __v: 0, isAdmin: 0, isModerator: 0 })
        if (!user) {
            throw Error("User account for the provided email cannot be found")
        }
        return user
    }
    , getUserById: async function (userId) {
        const uid = strToId(userId)
        const user = await this.findOne({ _id: uid }, { password: 0, emailVerified: 0, __v: 0, isAdmin: 0, isModerator: 0 })
        return user
    },
    getUserByIdc: async function (userId) {
        const uid = strToId(userId)
        const user = await this.findOne({ _id: uid }, { password: 0, emailVerified: 0, __v: 0 })
        return user
    },
    getUsersById: async function (userIds) {
        const uids = userIds.map(strToId)
        const users = await this.find({ _id: { $in: uids } }, { password: 0, emailVerified: 0, __v: 0, isAdmin: 0, isModerator: 0 })
        return users
    }
}

UserSchema.methods = {
    updateReputation: function() {
        this.reputation.reputationScore = 
        this.reputation.numberOfReportsCreated * 2 - 
        this.reputation.numberOfFalseReports * 5;
        return this.save();
    }
}

const User = mongoose.model("User", UserSchema)
module.exports = User