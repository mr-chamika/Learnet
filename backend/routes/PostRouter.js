const { Router } = require('../express');
const router = new Router();

const { createPost, getPost, getMyPost, deletePost, getOne, updatePost, setVote, setHide, setUnhide, searchPost } = require('../controllers/PostController.js');

router.post('/create', createPost);
router.post('/get', getPost);//get all posts
router.post('/getmy', getMyPost);
router.post('/getOne', getOne)//get one post
router.delete('/', deletePost);
router.post('/update', updatePost)
router.post('/vote', setVote)
router.post('/hide', setHide)
router.post('/unhide', setUnhide)
router.post('/search', searchPost)

module.exports = router;

/* const { Router } = require('../express');
const router = new Router();

const { createPost, getPost, getMyPost, deletePost, getOne, updatePost, setVote, setHide, setUnhide } = require('../controllers/PostController.js');
const ModeratorAuthenticationMiddleware = require('../middlewares/ModeratorAuthenticationMiddleware.js');
const moderatorRouter = new Router();

moderatorRouter.use(ModeratorAuthenticationMiddleware)
moderatorRouter.post('/hide', setHide)
moderatorRouter.post('/unhide', setUnhide)

router.use('/admin',moderatorRouter)
router.post('/create', createPost);
router.post('/get', getPost);//get all posts
router.post('/getmy', getMyPost);
router.post('/getOne', getOne)//get one post
router.delete('/', deletePost);
router.post('/update', updatePost)
router.post('/vote', setVote)


module.exports = router; */