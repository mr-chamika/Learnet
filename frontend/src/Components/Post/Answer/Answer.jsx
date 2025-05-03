import { useEffect, useState, useContext } from '../../../../react_lite/createDOM';
import './Answer.css';
import Icon from '../../../Assets/check.png';
import Comment from '../../Comment/Comment';
import Up from '../../../Assets/up-arrow.png';
import Down from '../../../Assets/down-arrow.png';
import PopUp from '../../PopUp/PopUp';
import { UserContext } from '../../../Contexts/UserContext';

const Answer = ({ answer, votes, createdAt, author, id, func, editAnswer, deleteAnswer, marked, userId, p_id }) => {

    const [load, setLoad] = useState(false);

    const [showPopUpComment, setShowPopUpComment] = useState(false);
    const [correct, setCorrect] = useState(marked);

    const [AcommentArray, setAcommentArray] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    const [clicked, setClicked] = useState(false);
    const [count, setCount] = useState(0);

    const { user } = useContext(UserContext);

    var now = new Date();

    var compare = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate(), createdAt.getHours(), createdAt.getMinutes(), createdAt.getSeconds());

    var diff = now - compare;
    var ago = '';

    if (diff < 0) {
        ago = "Invalid date";
    } else {
        var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        if (years > 0) {
            ago = `${years} year(s)`;
        } else {
            var months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            if (months > 0) {
                ago = `${months} month(s)`;
            } else {
                var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                if (days > 0) {
                    ago = `${days} day(s)`;
                } else {
                    var hours = Math.floor(diff / (1000 * 60 * 60));
                    if (hours > 0) {
                        ago = `${hours} hour(s)`;
                    } else {
                        var minutes = Math.floor(diff / (1000 * 60));
                        if (minutes > 0) {
                            ago = `${minutes} min(s)`;
                        } else {
                            var seconds = Math.floor(diff / 1000);
                            ago = `${seconds} second(s)`;
                        }
                    }
                }
            }
        }
    }

    const changeColor = () => {
        fetch(`http://localhost:8080/answer/mark`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                authorization: `bearer ${user.token}`

            },
            body: JSON.stringify({ p_id, id, marked: !correct })
        })
            .then(res => res.json())
            .then((data) => { if (data.message) { alert(data.message) } else { setCorrect(!correct); } })
            .catch((err) => console.log('Error from changeColor: ', err));
    };

    useEffect(() => {

        fetch('http://localhost:8080/comment/getAnswersComment', {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ id })

        })
            .then((res) => res.json())
            .then((data) => { setAcommentArray(data.data); setCount(data.count) })
            .catch(err => console.log('Error from get answers comments : ', err))

    }, [load, id])

    const editAnswerComment = (key) => {

        setEditCommentId(key);
        const commentToEdit = AcommentArray.find(comment => comment._id === key);
        setEditCommentText(commentToEdit.Comment);
        setShowPopUpComment(true);
    };

    // for answer comments


    const saveEditedComment = () => {

        if (editCommentText.trim().length == 0) {

            alert('Enter a valid comment to edit')

        } else {

            fetch(`http://localhost:8080/comment/editAnswerComment`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ editCommentId, editCommentText })
            })
                .then(() => { setEditCommentId(null); setEditCommentText(''); setLoad(!load); setClicked(false); setShowPopUpComment(false) })
                .catch((err) => console.log('Error from editAnswerComment' + err));

        }

    };

    const handleClosePopUpComment = () => {

        setShowPopUpComment(false)
        setEditCommentId(null);

    };

    //

    const deleteComment = (key) => {
        fetch(`http://localhost:8080/comment/delete`, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ key })
        })
            .then(() => { setLoad(!load); setClicked(false)/*alert(data.message);  setAcommentArray(data.data);  window.location.reload()*/ })
            .catch((err) => console.log('Error from deleteAnswerComment' + err))
    };

    const handleCommentSubmit = (e) => {

        e.preventDefault();

        if (newComment.trim().length != 0) {

            fetch('http://localhost:8080/comment/createForAnswer', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ aComment: newComment, id })
            })
                .then((res) => res.json())
                .then((data) => { setLoad(Date.now()); setNewComment(''); setClicked(false) })
                .catch(err => console.log('Error from create answers comments : ', err));

        } else {

            alert('Comment field must be filled');

        }
    };

    const editOnChange = (e) => { setEditCommentText(e.target.value) }


    const seeMore = () => {

        useEffect(() => {

            fetch('http://localhost:8080/comment/getAllAnswersComment', {

                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ id })

            })
                .then((res) => res.json())
                .then((data) => { setAcommentArray(data.data); setClicked(true); setCount(0) })
                .catch(err => console.log('Error from get answers comments : ', err))

        }, [])

    }


    return (

        <div className='answer-block'>
            <div className='wrap'>

                <div className="voting">

                    <button onClick={() => func(id, 1)}><img src={Up} width='10px' height='10px'></img></button>
                    <h3>{votes}</h3>
                    <button onClick={() => func(id, -1)}><img src={Down} width='10px' height='10px' /></button>
                    <br />
                    <br />
                    <button onClick={changeColor} className='tik' style={`background-color:${!correct ? 'white' : '#56ff56'}`}><img src={Icon} width='17px' height='21px' /></button>

                </div>


                <div className='a-left'>
                    <p className='answer'>{answer}</p>

                    <div className='answer-block-bottomt'>
                        {userId == user.userId && (<div className='buttons'>
                            <button onClick={editAnswer}>Edit</button>
                            <button onClick={deleteAnswer}>Delete</button>
                        </div>)}
                        <div className='ty'>
                            <p><a href='/user/profile-page'>{author}</a>&nbsp;{ago}&nbsp;ago</p>
                        </div>

                    </div>

                </div>

            </div>

            <div className='answers-comments'>

                {

                    AcommentArray.map((comment) => {

                        return (
                            <div className='withEdit' key={comment._id}>

                                <Comment
                                    comment={comment.Comment}
                                    createdAt={new Date(comment.createdAt)}
                                    author={comment.Author}
                                    a_id={id}
                                    fun_d={() => deleteComment(comment._id)}
                                    editComment={() => editAnswerComment(comment._id)}
                                    userId={comment.UserId}
                                />

                            </div>

                        )

                    })

                }

                {showPopUpComment &&

                    (<PopUp show={showPopUpComment}>

                        <textarea className='editing' type="text" value={editCommentText} onChange={editOnChange}></textarea>
                        <button onClick={saveEditedComment} className='save-b'>Save</button>
                        <button onClick={handleClosePopUpComment} className='cancel-b'>Cancel</button>

                    </PopUp>)

                }

                {
                    (count > 5 && !clicked) &&

                    (<div className="seemore" onClick={seeMore}>See more</div>)

                }

                <form className='answerComment' onSubmit={handleCommentSubmit}>
                    <input type="text" placeholder="Comment on answer ......." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button type="submit">Done</button>
                </form>

            </div>

        </div>

    );

};

export default Answer;