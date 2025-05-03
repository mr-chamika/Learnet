async function ModeratorAuthenticationMiddleware(req, res, next){
    if(!req.user){
        console.error("Moderator auth middleware should be placed after the User auth middleware in the middleware stack")
    }
    if(req.user.isModerator !== true && req.user.isAdmin !== true){
        res.json({error: "Access Denied: Moderator privileges are required to perform this action."})
        return true
    }else{
        return await next()
    }
}

module.exports = ModeratorAuthenticationMiddleware