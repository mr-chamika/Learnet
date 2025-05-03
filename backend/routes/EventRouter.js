const {Router} = require("../express")
const router = new Router()

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require("../controllers/EventsController");

router.post("/create", createEvent);
router.post("/all", getAllEvents);
router.post("/", getEventById);
router.patch("/update", updateEvent);
router.delete("/delete", deleteEvent);

module.exports = router;
