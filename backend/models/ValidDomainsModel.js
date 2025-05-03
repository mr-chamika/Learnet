const mongoose = require("mongoose");

const validDomainSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        unique: true,
    },
    university: {
        type: String,
        required: true
    },
    addedBy: {
        type: String, // admin ID who added the domain
        required: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ValidDomain = mongoose.model("ValidDomain", validDomainSchema);
module.exports = ValidDomain;
