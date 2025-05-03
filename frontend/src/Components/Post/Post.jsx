import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import './Post.css';
import Link from '../../Router/Link';
import Answer from './Answer/Answer';
import { routerContext } from "../../Router/Router";
import Up from '../../Assets/up-arrow.png';
import Down from '../../Assets/down-arrow.png';
import Comment from "../Comment/Comment";
import { UserContext } from "../../Contexts/UserContext";
import PopUp from "../PopUp/PopUp";
import Tag from "../Tag/Tag"

const Post = () => {

    const { params, goto } = useContext(routerContext);
    const { id } = params;

    const { user } = useContext(UserContext);

    //getting user role.......

    const userId = user.userId;

    const [role, setRole] = useState(false);
    const [username, setUsername] = useState('unknown')

    useEffect(() => {

        fetch('http://localhost:8080/user/get-onec', {

            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })

        })
            .then((res) => res.json())
            .then((data) => {

                setUsername(data.user.username)

                if (data.user.isModerator) {

                    setRole(true);


                }

                if (data.user.isAdmin) {

                    setRole(true);

                }

            })
            .catch((error) => console.log('Getting user role error : ', error));

    }, [])


    const [x, setX] = useState(false)// for update counts of comments/answers

    const [answer, setAnswer] = useState('');
    const [z, setZ] = useState([]);//to set answer array

    const [qComment, setQcomment] = useState('');
    const [qCommentArray, setQcommentArray] = useState([]);

    const [clicked, setClicked] = useState(false);

    useEffect(() => {

        if (!id) {

            return;
        }

        fetch('http://localhost:8080/answer/get', {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`
            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => { if (data.answers) { setZ(data.answers) } else if (data.message) { console.log(data.message) } })
            .catch((error) => console.log('Error from answer get : ', error))
    }, [id, z, x])

    const [editAnswerId, setEditAnswerId] = useState(null);
    const [editAnswerText, setEditAnswerText] = useState('');

    const editAnswer = (key) => {
        setEditAnswerId(key);
        const answerToEdit = z.find(answer => answer._id === key);
        setEditAnswerText(answerToEdit.Answer);
        setShowPopUpAnswer(true)
    };

    const deleteAnswer = (key) => {
        fetch(`http://localhost:8080/answer/delete`, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`
            },
            body: JSON.stringify({ key })
        })
            .then(res => res.json())
            .then((data) => { alert(data.message); setX(!x); /* window.location.reload() */ })
            .catch((err) => console.log('Error from deleteAnswer' + err))
    };

    //for edit question comment


    const [editQuestionCommentId, setEditQuestionCommentId] = useState(null);
    const [editQuestionCommentText, setEditQuestionCommentText] = useState('');


    const [showPopUpQComment, setShowPopUpQComment] = useState(false);

    const saveEditedQuestionComment = () => {

        if (editQuestionCommentText.trim().length == 0) {

            alert('Enter a valid comment to edit')

        } else {


            fetch(`http://localhost:8080/comment/editQuestionComment`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`
                },
                body: JSON.stringify({ editQuestionCommentId, editQuestionCommentText })
            })
                .then(() => { setEditQuestionCommentId(null); setEditQuestionCommentText(''); setX(!x); setShowPopUpQComment(false); setClicked(false) })
                .catch((err) => console.log('Error from editAnswerComment' + err));

        }

    };

    const handleClosePopUp = () => {

        setShowPopUpQComment(false)
        setEditQuestionCommentId(null);

    };

    //

    const editQuestionComment = (key) => {
        setEditQuestionCommentId(key);
        const QuestionCommentToEdit = qCommentArray.find(comment => comment._id === key);
        setEditQuestionCommentText(QuestionCommentToEdit.Comment);
        setShowPopUpQComment(true);

    };

    const deleteComment = (key) => {
        fetch(`http://localhost:8080/comment/delete`, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`
            },
            body: JSON.stringify({ key, id })
        })
            .then(res => res.json())
            .then((data) => { setX(!x); setClicked(false); setValues({ ...values, comments: data.count }) })
            .catch((err) => console.log('Error from deleteAnswer' + err))
    };

    // for edit answer

    const saveEditedAnswer = () => {

        if (editAnswerText.trim().length == 0) {

            alert('Enter a valid answer to edit');


        } else {

            fetch(`http://localhost:8080/answer/editAnswer`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`
                },
                body: JSON.stringify({ editAnswerId, editAnswerText })
            })
                .then(res => res.json())
                .then((data) => { if (data.message) { console.log(data.message); return } setEditAnswerId(null); setEditAnswerText(''); setX(!x); setShowPopUpAnswer(false) })
                .catch((err) => console.log('Error from editAnswer' + err));

        }

    };

    const [showPopUpAnswer, setShowPopUpAnswer] = useState(false);

    const handleClosePopUpA = () => {

        setShowPopUpAnswer(false)
        setEditAnswerId(null);

    };

    //

    var count = z.length ? z.length : '0';

    const increasing = () => {
        fetch(`http://localhost:8080/post/vote`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`
            },
            body: JSON.stringify({ id, change: 1 })
        })
            .then(res => res.json())
            .then((data) => { if (data.newVote) { setValues({ ...values, votes: data.newVote }) } else { alert(data.message) } })
            .catch((err) => console.log('Error from increasing vote: ', err));
    }

    const decreasing = () => {
        fetch(`http://localhost:8080/post/vote`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ id, change: -1 })
        })
            .then(res => res.json())
            .then((data) => { if (data.newVote) { setValues({ ...values, votes: data.newVote }) } else { alert(data.message) } })
            .catch((err) => console.log('Error from decreasing vote: ', err));
    }

    //for answers

    const answerVote = (id, change) => {
        fetch(`http://localhost:8080/answer/vote`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ id, change })
        })
            .then(res => res.json())
            .then((data) => {

                if (!data.message) {

                    setZ(z.map(ans => ans._id === id ? { ...ans, Votes: ans.Votes + change } : ans));

                } else {

                    alert(data.message);

                }
            })
            .catch((err) => console.log('Error from answerVote: ', err));
    };

    const f = id;

    const [values, setValues] = useState({
        title: "how to delete from database",
        question: "mehemai machan kohomda mongo db eken record ekk delete karanne",
        answers: 0,
        views: 0,
        votes: 0,
        updatedAt: '0000-00-00',
        tarray: [],
        createdAt: '0000-00-00',
        isHidden: false,
        comments: 0,
        expectation: 'Loading...'
    });

    useEffect(() => {

        if (!user.token) { goto('/user/forum'); }

        fetch(`http://localhost:8080/post/getOne`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setValues({
                        userId: data.data.userId,
                        title: data.data.title,
                        question: data.data.question,
                        createdAt: data.data.createdAt,
                        updatedAt: data.data.updatedAt,
                        views: data.data.views,
                        answers: data.data.answers,
                        votes: data.data.votes,
                        tarray: data.data.tarray,
                        isHidden: data.data.isHidden,
                        comments: data.data.comments,
                        expectation: data.data.expectation
                    });


                }

            })
            .catch(error => console.log("ERROR in edit : " + error));
    }, [id]);

    const changing = (e) => {
        setAnswer(e.target.value);
    }

    var day5 = new Date(values.createdAt);

    const handleAnswering = (e) => {
        e.preventDefault();

        if (answer.trim().length != 0) {
            fetch('http://localhost:8080/answer/create', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ id, answer })
            })
                .then(() => { alert('Answer submitted successfully'); setAnswer(''); setX(!x); })
                .catch((err) => console.log('Error from create answer : ', err));
        } else {
            alert('Answer can not be empty');
        };
    }

    var message = z.length == 0 ? 'No answers yet' : '';
    var class1 = z.length == 0 ? 'no' : '';

    const handleQuestionComment = (e) => {
        e.preventDefault();

        if (qComment.trim().length != 0) {
            fetch('http://localhost:8080/comment/createForQuestion', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ qComment, id })
            })
                .then((res) => res.json())
                .then((data) => { setQcomment(''); setClicked(false); setX(!x); setValues({ ...values, comments: data.count }) })
                .catch((err) => console.log('Error from handleQuestionComment : ', err))
        } else {
            alert('Comment can not be empty');
        }
    }

    useEffect(() => {

        if (!id) {

            return;
        }

        fetch('http://localhost:8080/comment/getQuestionsComment', {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => { if (data.data) { setQcommentArray(data.data); } else if (data.message) { console.log(data.message) } })
            .catch(err => console.log('Error from get comments : ', err))
    }, [x, id])

    const seeMore = () => {

        useEffect(() => {
            fetch('http://localhost:8080/comment/getAllQuestionsComment', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ id })
            })
                .then((res) => res.json())
                .then((data) => { setQcommentArray(data.data); setClicked(true); })
                .catch(err => console.log('Error from get comments : ', err))
        }, [qCommentArray])

    }

    const editAOnChange = (e) => { setEditAnswerText(e.target.value) }

    const editOnChange = (e) => { setEditQuestionCommentText(e.target.value) }

    var display = user.isModerator == false ? "" : values.isHidden ? 'Unhide' : 'Hide';

    const hide = () => {

        if (display == 'Hide') {

            fetch('http://localhost:8080/post/hide', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    authorization: `bearer ${user.token}`

                },
                body: JSON.stringify({ id, userId })
            })
                .then((res) => res.json())
                .then((data) => { alert(data); goto('/user/forum'); })
                .catch(err => console.log('Error from hide : ', err))

        } else {

            fetch('http://localhost:8080/post/unhide', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    authorization: `bearer ${user.token}`

                },
                body: JSON.stringify({ id, userId })
            })
                .then((res) => res.json())
                .then((data) => { alert(data); goto('/user/forum'); })
                .catch(err => console.log('Error from inhide : ', err))


        }
    }

    return (
        <div className="post">

            <div key={id} className="voting">

                <button className='but' onClick={increasing}><img src={Up} width='15px' height='15px'></img></button>
                <h3 className="h3">{values.votes}</h3>
                <button className='but' onClick={decreasing}><img src={Down} width='15px' height='15px'></img></button>

            </div>

            <div className="left">
                <div className="post-head">
                    <div className="sub-top">
                        <h2 className="topic">{values.title}</h2>
                        {role &&

                            (<div className="but0"><button className="action" onClick={hide}>{display}</button></div>)

                        }
                    </div>
                    <p>
                        Asked &nbsp;: {day5.toLocaleDateString()}&nbsp;@&nbsp;{day5.toLocaleTimeString()} &nbsp; &nbsp;&nbsp;&nbsp;
                        Viewed &nbsp;: {values.views}&nbsp; times &nbsp;&nbsp;&nbsp;
                    </p>

                    <hr></hr>

                </div>


                <p className="question">{values.question}</p>

                <div className="tagSection">

                    {

                        (values.tarray).map((tag) => {

                            return (

                                <div>
                                    <Tag

                                        name={tag}

                                    />
                                </div>

                            )

                        })

                    }

                </div>

                <h4><i>Expectations:</i></h4>
                <p className="expectation">{values.expectation}</p>


                <div className="discription">


                    <h3 className="comment-head">Comments {values.comments} </h3>

                    <div className="commentst">

                        {

                            qCommentArray.map((comment) => {

                                return (
                                    <div className='withEdit' key={comment._id}>
                                        <Comment

                                            comment={comment.Comment}
                                            createdAt={new Date(comment.createdAt)}
                                            author={comment.Author}
                                            fun_d={() => deleteComment(comment._id)}
                                            editComment={() => editQuestionComment(comment._id)}
                                            userId={comment.UserId}

                                        />

                                    </div>
                                )

                            })

                        }

                        {showPopUpQComment &&

                            (<PopUp show={showPopUpQComment}>

                                <textarea className='editing' type="text" value={editQuestionCommentText} onChange={editOnChange}></textarea>
                                <button onClick={saveEditedQuestionComment} className='save-b'>Save</button>
                                <button onClick={handleClosePopUp} className="cancel-b">Cancel</button>

                            </PopUp>)


                        }

                        {(((values.comments > 5) && clicked == false)) &&

                            (<div className="seemore" onClick={seeMore}>See more</div>)

                        }

                    </div>

                    <form className="questionComment" onSubmit={handleQuestionComment}>
                        <input placeholder={`Comments as ${username}`} value={qComment} onChange={(e) => { if (e.target.value != " ") { setQcomment(e.target.value) } else { alert("Enter a valid comment") } }}></input>
                        <button type="submit">Done</button>
                    </form>

                </div>

                <div className="answerst">

                    <h3>Answers {count}</h3>

                    <h5 className={class1}>{message}</h5>

                    {

                        z.map((a) => {

                            return (
                                <div className="multi-ans">

                                    <Answer
                                        key={a._id}
                                        answer={a.Answer}
                                        votes={a.Votes}
                                        createdAt={new Date(a.createdAt)}
                                        id={a._id}
                                        func={answerVote}
                                        p_id={id}
                                        editAnswer={() => editAnswer(a._id)}
                                        deleteAnswer={() => deleteAnswer(a._id)}
                                        marked={a.Marked}
                                        userId={a.userId}
                                        author={a.Author}
                                    />

                                </div>

                            )

                        })

                    }

                </div>

                {showPopUpAnswer &&

                    (<PopUp show={showPopUpAnswer}>

                        <textarea className='editing' type="text" value={editAnswerText} onChange={editAOnChange}></textarea>
                        <button onClick={saveEditedAnswer} className='save-b'>Save</button>
                        <button onClick={handleClosePopUpA} className='cancel-b'>Cancel</button>

                    </PopUp>)


                }

                {!(values.userId == user.userId) && (
                    <form className="user-answer" onSubmit={handleAnswering}>
                        <br></br>
                        <textarea placeholder="Write your answer......" type="text" value={answer} onChange={changing}></textarea>
                        <br></br>
                        <button type="submit">Submit Answer</button>
                    </form>

                )}

            </div>

            <div className="right">

                <Link to="/user/ask" label="Create question">Create question</Link>

            </div>

        </div>

    );

}

export default Post;