const {Router} = require("../express")
const router = new Router()

const { 
    createOrder,
    getPlans
} = require("../controllers/PaymentController")

router.post("/get-plans", getPlans)
router.post("/create-order", createOrder)

module.exports = router