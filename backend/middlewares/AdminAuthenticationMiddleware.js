async function AdminAuthenticationMiddleware(req, res, next){
    if(!req.user){
        console.error("Admin auth middleware should be placed after the User auth middleware in the middleware stack")
    }
    if(req.user.isAdmin !== true){
        res.json({error: "Access Denied: Administrative privileges are required to perform this action."})
        return true
    }else{
        return await next()
    }
}

module.exports = AdminAuthenticationMiddleware