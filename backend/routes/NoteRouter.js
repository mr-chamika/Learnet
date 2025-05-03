const {Router} = require("../express")
const router = new Router()

const {
    getNote,
    createNote,
    editNote,
    deleteNote
 } = require("../controllers/NoteController")

router.post("/create", createNote)
router.post("/get", getNote)
router.patch("/", editNote)
router.delete("/", deleteNote)

module.exports = router