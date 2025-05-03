const Comment = require('../models/CommentModel.js')
const Post = require('../models/PostModel.js');
const User = require('../models/UserModel.js')
const Answer = require('../models/AnswerModel.js');
const { strToObjId } = require('../utils/strToObjId.js');

const createQComment = async (req, res) => {//Done

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { qComment, id } = req.body;

    const creator = await User.getUserById(req.user.userId.toString());

    const newComment = await new Comment({ Comment: qComment, Question_id: id, UserId: req.user.userId, Author: creator.username })

    try {

        await newComment.save();
        const count = await Comment.countDocuments({ Question_id: id });

        await Post.findByIdAndUpdate(id, { $set: { comments: count } }, { new: true });

        res.json({ count });

    } catch (error) {

        res.json({ message: 'Error from question comment get backend' + error });

    }

}

const createAComment = async (req, res) => {

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { aComment, id } = req.body;

    const creator = await User.getUserById(req.user.userId.toString());

    const newComment = new Comment({ Comment: aComment, Answer_id: id, UserId: req.user.userId, Author: creator.username })

    try {

        newComment.save();
        res.json({ message: 'Comment saved successfully' });

    } catch (error) {

        res.json({ message: 'Error from question comment get backend' + error });

    }

}

const getQComment = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id } = req.body;

    try {

        const data = await Comment.aggregate([
            { $match: { Question_id: id } },
            { $addFields: { commentLength: { $strLenCP: "$Comment" } } },
            {
                $sort: {

                    commentLength: -1,
                    createdAt: -1,

                }
            },
            { $limit: 5 }
        ]);
        if (data) { res.json({ data }) }

    } catch (error) {

        res.json({ message: 'Error from question comment get backend' + error })

    }
}

const getAllQComment = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id } = req.body;

    try {

        const data = await Comment.find({ Question_id: id }).sort({ createdAt: -1 });

        if (data) { res.json({ data }) }

    } catch (err) {

        res.json({ message: 'Error from question comment get backend' + err.message })

    }
}

const getAComment = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id } = req.body;

    try {

        const data = await Comment.aggregate([
            { $match: { Answer_id: id } },
            { $addFields: { commentLength: { $strLenCP: "$Comment" } } },
            {
                $sort: {

                    commentLength: -1,
                    createdAt: -1,

                }
            },
            { $limit: 5 }
        ]);

        const count = await Comment.countDocuments({ Answer_id: id })

        await Answer.findByIdAndUpdate(id, { $set: { comments: count } })

        res.json({ data, count })

    } catch (err) {

        res.json({ message: 'Error from answer comment get backend' + err.message })

    }
}

const getAllAComment = async (req, res) => {

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id } = req.body;

    try {

        const data = await Comment.find({ Answer_id: id }).sort({ createdAt: -1 });

        res.json({ data })

    } catch (err) {

        res.json({ message: 'Error from answer comment get backend' + err.message })

    }
}

const deleteComment = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { key, id } = req.body;

    try {

        const toDelete = await Comment.findOne({ _id: key })

        if (req.user.userId.equals(strToObjId(toDelete.UserId))) {

            //const d = await Comment.findByIdAndDelete({ _id: key });

            if (toDelete) {

                await toDelete.deleteOne();

                const count = await Comment.countDocuments({ Question_id: id });

                await Post.findByIdAndUpdate(id, { $set: { comments: count } }, { new: true });
                res.json({ count })

            } else {

                res.json({ message: 'Comment not found' })

            }


        }


    } catch (err) {

        res.json({ message: `Error:${err}` })

    }

}

const editAComment = async (req, res) => {

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { editCommentId, editCommentText } = req.body;

    try {

        const toEdit = await Comment.findOne({ _id: editCommentId })

        if (req.user.userId.equals(strToObjId(toEdit.UserId))) {


            const newC = await Comment.findByIdAndUpdate(editCommentId, { $set: { Comment: editCommentText } }, { new: true })

            if (newC) { res.json({ newC }) } else { message: 'Comment does not exists' }

        }

    } catch (err) {

        res.json({ message: 'Error : ' + err })

    }

}

const editQComment = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { editQuestionCommentId, editQuestionCommentText } = req.body;

    try {

        const toEdit = await Comment.findOne({ _id: editQuestionCommentId })

        if (req.user.userId.equals(strToObjId(toEdit.UserId))) {

            const editedQuestionComment = await Comment.findByIdAndUpdate(editQuestionCommentId, { $set: { Comment: editQuestionCommentText } }, { new: true })

            if (editedQuestionComment) { res.json({ editedQuestionComment }) } else { message: 'Comment does not exists' }

        }

    } catch (err) {

        res.json({ message: 'Error : ' + err })

    }

}
module.exports = { createQComment, createAComment, getQComment, getAComment, deleteComment, editAComment, editQComment, getAllQComment, getAllAComment };