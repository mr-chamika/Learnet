const {Router} = require("../express")
const router = new Router()
const UserAuthenticationMiddleware = require("../middlewares/UserAuthenticationMiddleware.js");

const {
    getReleventBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    getOneBlog,
    addLike,
    addComment,
    
    getUserTags,
    updateUserTags,
    getUserBlogs,
    getSavedBlogs,
    removeLike,
    removeComment,
    getBlogComments,
    addCommentLike,
    removeCommentLike,
    addSave,
    removeSave,
} = require("../controllers/blogController.js")


router.post("/get-user-blogs", getUserBlogs);
router.post("/get-relevent",getReleventBlogs);
router.post("/get",getOneBlog);
router.post("/create", createBlog);
router.patch("/", updateBlog);
router.delete("/", deleteBlog);
router.post("/add-like", addLike);
router.post("/remove-like", removeLike);
router.post("/get-comments", getBlogComments);
router.post("/add-comment", addComment);
router.post("/remove-comment", removeComment);
router.post("/add-comment-like", addCommentLike);
router.post("/remove-comment-like", removeCommentLike);

router.get("/user/tags", getUserTags);
router.patch("/user/tags", updateUserTags);

router.post("/saved-blogs",getSavedBlogs);
router.post("/add-save",  addSave);
router.post("/remove-save", removeSave);

module.exports = router