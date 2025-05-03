const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const Answer = require('../models/AnswerModel');
const User = require('../models/UserModel');
const { strToObjId } = require('../utils/strToObjId');
const { rawListeners } = require('../models/UserModel');


const createPost = async (req, res) => { //completed

    const { title, question, expectation, tarray, select } = req.body;

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const creator = await User.getUserById(req.user.userId.toString());

    const postNew = await new Post({
        userId: req.user.userId,
        title: title,
        question: question,
        expectation: expectation,
        tarray: tarray,
        author: creator.username,
        role: select

    })

    postNew.save();

    res.json({ postNew });

}

const getPost = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    try {

        const data = await Post.find();

        res.json({ data });

    } catch (error) {

        res.json({ error });

    }

}

const getMyPost = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    try {

        const data = await Post.find({ userId: req.user.userId });
        res.json({ data });

    } catch (error) {

        res.json({ "message": error.message });

    }

}

const getOne = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    try {

        const { id } = req.body;

        const data = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

        if (data) {

            res.json({ data });
        }

    } catch (error) {

        res.json({ error });

    }


}

const deletePost = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    try {


        const { id } = req.body;

        const currentPost = await Post.findOne({ _id: id });

        if (req.user.userId.equals(strToObjId(currentPost.userId))) {

            await currentPost.deleteOne()
            await Comment.deleteMany({ Question_id: id })
            await Answer.deleteMany({ Question_id: id })

            res.json({ message: "This post's comments and answers deleted" })
        } else {
            res.json({ message: "Unauthorized" })
        }

    } catch (error) {

        res.json({ message: "error ekek bosa" })

    }

}

const updatePost = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    try {

        const { values, id } = req.body;

        const toUpdate = await Post.findOne({ _id: id })

        if (req.user.userId.equals(strToObjId(toUpdate.userId))) {

            const data = await Post.findByIdAndUpdate(

                id,
                {
                    $set: {
                        title: values.title,
                        question: values.question,
                        expectation: values.expectation,
                        tarray: values.tarray,
                    }
                },
                { new: true }

            )

            if (data) {

                res.json({ message: "Update success" });

            }

        }

    } catch (error) {

        console.log("Error from update backend : ", error);

    }




}

const setVote = async (req, res) => {//completed
    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id, change } = req.body;

    try {

        const currentQuestion = await Post.findById(id);

        if (!(req.user.userId.equals(currentQuestion.userId))) {

            const exists = currentQuestion.voted_list.includes(req.user.userId)

            if (exists) {

                res.json({ message: "You are already voted" })
                return;
            }

            const newVote = change + currentQuestion.votes;

            await Post.findByIdAndUpdate(id, { $set: { votes: newVote } });

            await Post.findByIdAndUpdate(

                id,
                { $push: { voted_list: req.user.userId } }

            )
            res.json({ newVote })

        } else {

            res.json({ message: "You can not vote your post" })

        }

    } catch (err) {

        console.log('Error from set vote' + err)

    }

}

const setHide = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id, userId } = req.body;

    try {

        const curUser = await User.getUserByIdc(userId);

        if (curUser.isModerator || curUser.isAdmin) {

            const updatedQuestion = await Post.findByIdAndUpdate(id, { $set: { isHidden: true } }, { new: true });

            if (updatedQuestion) { res.json(id + " post hidden") }

        } else {

            res.json("You are not moderator or an admin")

        }

    } catch (err) {

        console.log('Error from hidding post' + err)

    }

}

const setUnhide = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id, userId } = req.body;

    try {

        const curUser = await User.getUserByIdc(userId);

        if (curUser.isModerator || curUser.isAdmin) {

            const updatedQuestion = await Post.findByIdAndUpdate(id, { $set: { isHidden: false } }, { new: true });

            if (updatedQuestion) { res.json(id + " post has been unhide") }

        } else {

            res.json("You are not moderator or an admin")
        }

    } catch (err) {

        console.log('Error from unhidding post' + err)

    }

}

const searchPost = async (req, res) => {

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { keyword } = req.body;

    try {

        const data = await Post.find({ title: { $regex: keyword, $options: 'i' } });

        if (data.length != 0) {

            res.json({ data });

        } else {

            res.json({ message: 'No match found' })

        }

    } catch (error) {

        res.json({ error });

    }

}

module.exports = { createPost, getPost, getMyPost, deletePost, getOne, updatePost, setVote, setHide, setUnhide, searchPost };