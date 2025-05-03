const {Router} = require("../express")
const router = new Router()

const {
    getFileFeed,
    getLinkFeed,
    getVideoFeed,
    getBlogFeed,
    getEventFeed,
    getNoteFeed,
    getRandomFeed,
    getSearchBasedFeed
} = require("../controllers/FeedController")

// const { getUsersAMController, getUserAMController, suspendUserAMController, searchUsersAMController, activateUserAMController } = require("../AMControllers/userAMController")

const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware")
const AdminAuthenticationMiddleware = require("../middlewares/AdminAuthenticationMiddleware")

const userAuthSubRouter = new Router()
userAuthSubRouter.use(UserAuthenticationMiddleware)
// userAuthSubRouter.post("/get-profile-picture", getUserProfilePictureController)

const adminAuthSubRouter = new Router()
adminAuthSubRouter.use(UserAuthenticationMiddleware)
adminAuthSubRouter.use(AdminAuthenticationMiddleware)
// adminAuthSubRouter.post("/search", searchUsersAMController)
// adminAuthSubRouter.post("/get", getUsersAMController)
// adminAuthSubRouter.post("/get-one", getUserAMController)
// adminAuthSubRouter.post("/suspend", suspendUserAMController)
// adminAuthSubRouter.post("/activate", activateUserAMController)

router.use("/admin", adminAuthSubRouter)
router.use("/auth", userAuthSubRouter)
router.post("/file", getFileFeed)
// router.post("/link", getLinkFeed)
// router.post("/video", getVideoFeed)
// router.post("/blog", getBlogFeed)
// router.post("/event", getEventFeed)
// router.post("/note", getNoteFeed)
router.post("/random", getRandomFeed)
router.post("/search", getSearchBasedFeed)

module.exports = router