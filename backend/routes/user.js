const {Router} = require("../express")
const router = new Router()

router.post("/login", (req, res)=>{
    // console.log(req)
    console.log(" in login req body : ", req.body)
    res.write(JSON.stringify({success : "message received"}))
    res.end()
})

module.exports = router