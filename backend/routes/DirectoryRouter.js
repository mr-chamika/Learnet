const {Router} = require("../express")
const router = new Router()

const {
    getDirectory,
    createDirectory,
    editDirectory,
    deleteDirectory,
    search
 } = require("../controllers/DirectoryController")

router.post("/", createDirectory)
router.post("/all", getDirectory)
router.post("/search", search)
router.patch("/", editDirectory)
router.delete("/", deleteDirectory)

module.exports = router