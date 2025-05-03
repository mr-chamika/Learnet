const { getDomains, addDomain, removeDomain } = require("../controllers/DomainController")
const {Router} = require("../express")
const AdminAuthenticationMiddleware = require("../middlewares/AdminAuthenticationMiddleware")
const router = new Router()

router.use(AdminAuthenticationMiddleware)
router.post("/get", getDomains)
router.post("/add", addDomain)
router.post("/remove", removeDomain)

module.exports = router