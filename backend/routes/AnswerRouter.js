const { Router } = require('../express.js');
const { createAnswer, getAnswer, editAnswer, deleteAnswer, setVote, setMark } = require('../controllers/AnswerController.js');
const router = new Router();

router.post('/create', createAnswer);
router.post('/get', getAnswer);
router.post('/editAnswer', editAnswer)
router.delete('/delete', deleteAnswer)
router.post('/vote', setVote)
router.post('/mark', setMark)

module.exports = router;

