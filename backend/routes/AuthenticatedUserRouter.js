const {Router} = require("../express")
const router = new Router()

const {
    getUIDImage,
 } = require("../controllers/UserController")

router.post("/get-uid", getUIDImage)

module.exports = router