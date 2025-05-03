const { sendFriendRequest, acceptFriendRequest, removeFriend, getFriendSuggestions, rejectRequest, getUserFriends, cancelFriendRequest, getFriendList } = require("../controllers/friendController");
const {Router} = require("../express")
const router = new Router()

router.post("/get-user-friends", getUserFriends);
router.post("/get-friend-list", getFriendList);
router.post("/send-request", sendFriendRequest);
router.post("/cancel-request", cancelFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.post("/reject-request", rejectRequest);
router.post("/remove-friend", removeFriend);
router.post("/suggestions", getFriendSuggestions);

module.exports = router