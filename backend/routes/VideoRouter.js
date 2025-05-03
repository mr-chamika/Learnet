const {Router} = require("../express")
const router = new Router()

const {
    getVideo,
    createVideo,
    editVideo,
    deleteVideo
 } = require("../controllers/VideoController")

router.post("/create", createVideo)
router.post("/get", getVideo)
router.patch("/", editVideo)
router.delete("/", deleteVideo)

module.exports = router