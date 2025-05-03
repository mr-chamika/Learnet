const { getContent, getFile } = require("../controllers/ContentController")
const {Router} = require("../express")
const ModeratorAuthenticationMiddleware = require("../middlewares/ModeratorAuthenticationMiddleware")
const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware")
const router = new Router()

router.use(UserAuthenticationMiddleware)
router.use(ModeratorAuthenticationMiddleware)
router.post("/get", getContent)
router.post("/get/file", getFile)

module.exports = router