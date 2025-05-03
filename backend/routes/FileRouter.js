const {Router} = require("../express")
const router = new Router()

const {
    getFile,
    createFile,
    createChatFile,
    editFile,
    deleteFile,
    getFileMetadata,
    getPublicFilesMetaOfUser
 } = require("../controllers/FileController")

router.post("/create", createFile)
router.post("/create-chatfile", createChatFile)
router.post("/get", getFile)
router.post("/get-info", getFileMetadata)
router.post("/get-public", getPublicFilesMetaOfUser)
router.patch("/", editFile)
router.delete("/", deleteFile)

module.exports = router