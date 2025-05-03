const { Router } = require('../express')
const { createAComment, createQComment, getQComment, getAComment, deleteComment, editAComment, editQComment, getAllQComment, getAllAComment } = require('../controllers/CommentController.js')
const router = new Router();

router.post('/createForQuestion', createQComment)
router.post('/createForAnswer', createAComment)
router.post('/getQuestionsComment', getQComment)
router.post('/getAllQuestionsComment', getAllQComment)
router.post('/getAnswersComment', getAComment)
router.post('/getAllAnswersComment', getAllAComment)
router.delete('/delete', deleteComment)
router.post('/editAnswerComment', editAComment)
router.post('/editQuestionComment', editQComment)

module.exports = router;