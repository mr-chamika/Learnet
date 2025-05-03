const {Router} = require("../express")
const router = new Router()

const {
    getLink,
    createLink,
    editLink,
    deleteLink
 } = require("../controllers/LinkController")

router.post("/create", createLink)
router.post("/get", getLink)
router.patch("/", editLink)
router.delete("/", deleteLink)

module.exports = router