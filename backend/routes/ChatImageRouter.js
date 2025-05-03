const {Router} = require("../express")
const router = new Router()

const {
    getFile,
    createFile,
    // editFile,
    deleteFile,
 } = require("../controllers/ChatImageController")

router.post("/create", createFile)
router.post("/get", getFile)
// router.patch("/", editFile)
router.delete("/", deleteFile)

module.exports = router