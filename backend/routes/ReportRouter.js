const {Router} = require("../express")
const router = new Router()

const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware")
const ModeratorAuthenticationMiddleware = require("../middlewares/ModeratorAuthenticationMiddleware")
const { createReport, getReports, submitVote } = require("../controllers/ReportController")

const userAuthSubRouter = new Router()
userAuthSubRouter.use(UserAuthenticationMiddleware)
userAuthSubRouter.post("/create", createReport)


const moderatorAuthSubRouter = new Router()
moderatorAuthSubRouter.use(UserAuthenticationMiddleware)
moderatorAuthSubRouter.use(ModeratorAuthenticationMiddleware)
moderatorAuthSubRouter.post("/get", getReports)
moderatorAuthSubRouter.post("/vote", submitVote)

router.use("/moderator", moderatorAuthSubRouter)
router.use("/auth", userAuthSubRouter)
// router.post("/video", getVideoTest)

module.exports = router