const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")

async function UserAuthenticationMiddleware(req, res, next){
    let token
    try{
        token = req.headers.authorization.split(" ")[1]
    }catch(err){
        console.log({error: "authentication toekn is required",})
        res.json({
            error: "authentication toekn is required",
            errorCode: 6
        })
        return true
    }

    console.log("token : ", token)

    if(token){
        let tokenPayload
        try{
            tokenPayload = jwt.verify(token, process.env.SECRETE_KEY)
        }catch(err){
            if(err instanceof jwt.TokenExpiredError){
                console.log({error: "token has expired",})
                res.json({
                    error: "token has expired",
                    errorCode: 5
                })
            }else if(err instanceof jwt.JsonWebTokenError){
                console.log({error: "token is invalid", no: 1, tokenPayload})
                res.json({
                    error: "token is invalid",
                    errorCode: 4
                })
            }else{
                console.log("error : ", err)
                res.status(500)
            }
            return true
        }
    
        if(tokenPayload){
            const user = await User.findOne({email: tokenPayload.email})
            if(user){
                req.user = {userId: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isModerator: user.isModerator}
                if(user.isSuspended){
                    res.json({
                        error: "Your account has been suspended",
                        errorCode: 7
                    })
                    return true
                }
                console.log(req.user)
                return await next()
            }else{
                console.log({error: "token is invalid", no : 2})
                res.json({
                    error: "token is invalid",
                    errorCode: 4
                })
                return true
            }
        }
    }
}

module.exports = UserAuthenticationMiddleware