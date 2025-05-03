const Answer = require('../models/AnswerModel.js');
const Comment = require('../models/CommentModel.js');
const User = require('../models/UserModel.js')
const Post = require('../models/PostModel.js');
const { strToObjId } = require('../utils/strToObjId.js');

const createAnswer = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id, answer } = req.body;

    const creator = await User.getUserById(req.user.userId.toString());

    const newAnswer = await new Answer({ Post_id: id, Answer: answer, Author: creator.username, userId: req.user.userId });

    try {

        const xPost = await Post.findByIdAndUpdate(id, { $inc: { answers: 1 } }, { new: true });

        newAnswer.save();

        res.json({ message: 'Answer posted' });

    } catch (error) {

        res.json({ message: 'Error from answer create from backend' })

    }

}

const getAnswer = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id } = req.body;

    try {

        const answers = await Answer.find({ Post_id: id })

        if (answers) {

            res.json({ answers })

        }


    } catch (error) {

        res.json({ error })
        console.log(error + ' in naswer controller')


    }



}

const editAnswer = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { editAnswerId, editAnswerText } = req.body;

    try {

        const toEdit = await Answer.findOne({ _id: editAnswerId });

        if (req.user.userId.equals(strToObjId(toEdit.userId))) {

            const data = await Answer.findByIdAndUpdate(editAnswerId, { $set: { Answer: editAnswerText } });

            res.json({ data })

        }

    } catch (err) {

        res.json({ message: 'Error from edit answer' + err })

    }
}

const deleteAnswer = async (req, res) => {//completed


    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { key } = req.body;

    try {

        const toDelete = await Answer.findOne({ _id: key });

        if (req.user.userId.equals(strToObjId(toDelete.userId))) {

            const deletedAnswer = await Answer.findByIdAndDelete(key);

            const itsComments = await Comment.find({ Answer_id: key });

            if (itsComments) {

                await Comment.deleteMany({ Answer_id: key });

            }

            if (deletedAnswer) { await Post.findByIdAndUpdate(deletedAnswer.Post_id, { $inc: { answers: -1 } }); res.json({ message: "Answer and it's Comments deleted" }) } else { res.json({ message: "Error from delete answer" }) }

        }

    } catch (err) {

        res.json({ message: 'Error from delete answer' + err })

    }
}

const setVote = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { id, change } = req.body;

    try {

        const currentAnswer = await Answer.findById(id);

        if (!(req.user.userId.equals(strToObjId(currentAnswer.userId)))) {

            const exists = currentAnswer.voted_list.includes(req.user.userId)

            if (exists) {

                res.json({ status: exists, message: "You are already voted" })
                return;
            }

            var newVote = change + currentAnswer.Votes;

            const updatedAnswer = await Answer.findByIdAndUpdate(id, { $set: { Votes: newVote } });

            await Answer.findByIdAndUpdate(

                id,
                { $push: { voted_list: req.user.userId } }

            )

            if (updatedAnswer) { res.json({ updatedAnswer }) }

        } else {

            res.json({ message: 'You cannot vote your own answer' })

        }

    } catch (err) {

        console.log('Error from set vote' + err)

    }

}

const setMark = async (req, res) => {//completed

    if (!req.user.userId) {

        res.json({ message: "Unauthorized" });
        return;

    }

    const { p_id, id, marked } = req.body;

    try {

        const toMark = await Answer.findOne({ _id: id });

        if (!(req.user.userId.equals(strToObjId(toMark.userId)))) {

            const markedAnswer = await Answer.findByIdAndUpdate(id, { $set: { Marked: marked } }, { new: true });
            const curPost = await Post.findOne({ _id: p_id })

            if (marked) {

                await curPost.updateOne({ $inc: { markedCount: 1 } }, { new: true })

            } else {

                await curPost.updateOne({ $inc: { markedCount: -1 } }, { new: true })

            }

            if (markedAnswer) { res.json({ markedAnswer }) }

        } else {

            res.json({ message: 'You cannot mark your own answer is correct' })

        }

    } catch (err) {

        console.log('Error from set mark' + err)

    }

}

module.exports = { createAnswer, getAnswer, editAnswer, deleteAnswer, setVote, setMark };