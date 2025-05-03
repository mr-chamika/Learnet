const { getAllTags, createTag } = require("../controllers/TagContoller")
const {Router} = require("../express")
const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware")
const router = new Router()

const userAuthSubRouter = new Router()
userAuthSubRouter.use(UserAuthenticationMiddleware)
userAuthSubRouter.post("/create", createTag)

router.use("/auth", userAuthSubRouter)
router.post("/get", getAllTags)

module.exports = router