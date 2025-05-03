const { Router } = require("../express");
const router = new Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require("../controllers/TasksController");

router.post("/create", createTask);
router.post("/all", getAllTasks);
router.post("/", getTaskById);
router.patch("/update", updateTask);
router.delete("/delete", deleteTask);

module.exports = router;





/*const {Router} = require("../express")
const router = new Router()

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require("../controllers/TasksController");

router.post("/create", createTask);
router.post("/all", getAllTasks);
router.post("/", getTaskById);
router.patch("/", updateTask);
router.delete("/", deleteTask);

module.exports = router;
*/