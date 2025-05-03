const ValidDomain = require("../models/ValidDomainsModel");
const { strToObjId } = require("../utils/strToObjId");

async function getDomains(req, res){
    const domains = await ValidDomain.find({})
    .populate("addedBy", "username")   
    res.json(domains)
}

async function addDomain(req, res){
    const {domain, university} = req.body
    const adminId = req.user.userId
    const domainObj = new ValidDomain({domain, university, addedBy: adminId})
    await domainObj.save()
    res.json(domainObj)
}

async function removeDomain(req, res){
    const {domainId} = req.body
    await ValidDomain.deleteOne({_id: strToObjId(domainId)})
    res.json({message: "Domain removed"})
}

module.exports = {
    getDomains,
    addDomain,
    removeDomain
}