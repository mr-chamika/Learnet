const { Router } = require("../express")
const router = new Router()

const {
    loginController,
    signupController,
    forgotPWController,
    emailVerificationController,
    sendingVerificationCodeController,
    getUsersController,
    getUserController,
    getUserControllerc,
    getUserProfilePictureController,
    getVideoTest,
    usernameAvailabilityController,
    changePasswordController,
} = require("../controllers/UserController")

const { getUsersAMController, getUserAMController, suspendUserAMController, searchUsersAMController, activateUserAMController } = require("../AMControllers/userAMController")

const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware")
const AdminAuthenticationMiddleware = require("../middlewares/AdminAuthenticationMiddleware")

const userAuthSubRouter = new Router()
userAuthSubRouter.use(UserAuthenticationMiddleware)
userAuthSubRouter.post("/validate-token", (req, res) => {
    res.sendStatus(200)
})
userAuthSubRouter.post("/get-profile-picture", getUserProfilePictureController)
userAuthSubRouter.post("/get", getUsersController)

const adminAuthSubRouter = new Router()
adminAuthSubRouter.use(UserAuthenticationMiddleware)
adminAuthSubRouter.use(AdminAuthenticationMiddleware)
adminAuthSubRouter.post("/search", searchUsersAMController)
adminAuthSubRouter.post("/get", getUsersAMController)
adminAuthSubRouter.post("/get-one", getUserAMController)
adminAuthSubRouter.post("/suspend", suspendUserAMController)
adminAuthSubRouter.post("/activate", activateUserAMController)

router.use("/admin", adminAuthSubRouter)
router.use("/auth", userAuthSubRouter)
router.post("/video", getVideoTest)
// router.post("/get-uid", getUserProfilePictureController)
router.post("/get", getUsersController)
router.post("/get-one", getUserController)
router.post("/get-onec", getUserControllerc)
router.post("/login", loginController)
router.post("/change-pw", changePasswordController)
router.post("/username-availability", usernameAvailabilityController)
router.post("/signup", signupController)
router.post("/verify-email", emailVerificationController)
router.post("/get-otp", sendingVerificationCodeController)
router.post("/forgotpw", forgotPWController)

module.exports = router