import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import './MyPost.css';
import Link from "../../Router/Link";
import Answer from '../Post/Answer/Answer';
import { routerContext } from "../../Router/Router";
import Up from '../../Assets/up-arrow.png';
import Down from '../../Assets/down-arrow.png';
import { postContext } from "../../Contexts/postContext";
import Comment from "../Comment/Comment";

const MyPost = () => {

    const [x, setX] = useState(false)

    const { load, setLoad } = useContext(postContext);

    const [votes, setVotes] = useState(1);

    const [Tvotes, setTVotes] = useState(1);

    const [answer, setAnswer] = useState('');
    const [z, setZ] = useState([]);

    const [qComment, setQcomment] = useState('');
    const [qCommentArray, setQcommentArray] = useState([]);

    const [answerComments, setAnswerComment] = useState({})

    const increasing = () => {

        setVotes(votes + 1);

    }

    const decreasing = () => {

        setVotes(votes - 1);

    }

    //for answers

    const answerVote = (id, change) => {

        setTVotes(Tvotes + 1)

        setZ(z.map(ans =>
            ans._id === id ? { ...ans, Votes: ans.Votes + change } : ans
        ));

    };


    const { params } = useContext(routerContext);
    const { id } = params;

    const [values, setValues] = useState({
        title: "how to delete from database",
        question: "mehemai machan kohomda mongo db eken record ekk delete karanne",
        answers: 0,
        views: 0,
        updatedAt: '0000-00-00',
        tarray: [],
        createdAt: '0000-00-00',
    });

    useEffect(() => {

        fetch(`http://localhost:8080/post/getOne`, {

            method: 'POST',
            body: JSON.stringify({ id })

        })
            .then(res => res.json())
            .then(data => { setValues({ title: data.data[0].title, question: data.data[0].question, createdAt: data.data[0].createdAt, updatedAt: data.data[0].updatedAt, views: data.data[0].views, answers: data.data[0].answers, tarray: data.data[0].tarray }); })
            .catch(error => console.log("ERROR in edit : ", error));

    }, [id])

    // const { params } = useContext(routerContext)
    // const { postId } = params

    // "/post/get"
    // ""
    // useEffect(()=>{
    //     fetch("endpoint", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             postId: postId
    //         })
    //     })
    //     .then(res=>res.json())
    //     .then((data)=>{
    //         if(!data.error){
    //             setDetails(data)
    //         }
    //     })
    // })

    const authors = [

        { id: 1, name: "Alexander Smith", age: 12 },
        { id: 2, name: "Hiroshi Tanaka", age: 45 },
        { id: 3, name: "Mateo Garcia", age: 5 },
        { id: 4, name: "Ethan Brown", age: 12 },
        { id: 5, name: "Noah Williams", age: 45 },
        { id: 6, name: "Lian Johnson", age: 5 },

    ]

    var day1 = new Date();
    day1.setFullYear(2011);
    day1.setMonth(1);
    day1.setDate(day1.getDate() - 1);
    day1.setHours(12, 23, 0);

    var day5 = new Date(values.createdAt);
    var day6 = new Date(values.updatedAt);

    var modified = ''

    values.updatedAt != values.createdAt ? modified = `Modified &nbsp;: ${day6.toLocaleDateString()}&nbsp;@&nbsp;${day6.toLocaleTimeString()} &nbsp;&nbsp;&nbsp;` : modified = ''

    var q1 = [

        { link: "https://www.wikipedia.org/", tag: "assembly" },
        { link: "https://www.wikipedia.org/", tag: "Arm64" },
        { link: "https://www.wikipedia.org/", tag: "opcode" },
        { link: "https://www.wikipedia.org/", tag: "instruction-encoding" },

    ];

    var message = z.length == 0 ? 'No answers yet' : '';
    var class1 = z.length == 0 ? 'no' : '';

    var body = [
        {
            comment: 'this is first commentthis is first commentthis is first commentthis is first comment',
            createdAt: new Date(),
            author: 'jane foster'
        },
        {
            comment: 'this is first commentthis is first commentthis is first commentthis is first comment',
            createdAt: new Date(),
            author: 'jane foster'
        }
    ]

    useEffect(() => {


        fetch('http://localhost:8080/answer/get', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })

        })
            .then((res) => res.json())
            .then((data) => { setZ(data.answers); })
            .catch((err) => console.log('Error from answer getting : ', err));

    }, [x, id])

    useEffect(() => {

        fetch('http://localhost:8080/comment/getQuestionsComment', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })

        })
            .then((res) => res.json())
            .then((data) => { setQcommentArray(data.data); })
            .catch(err => console.log('Error from get comments : ', err))

    }, [x, id])

    const handleQuestionComment = (e) => {

        e.preventDefault();

        if (qComment != '') {

            fetch('http://localhost:8080/comment/createForQuestion', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qComment, id })

            })
                .then((res) => res.json())
                .then(() => { setX(x => !x); setQcomment(''); })
                .catch((err) => console.log('Error from handleQuestionComment : ', err))


        } else {

            alert('Comment can not be empty');

        }

    }

    const handlesubmit = (id) => {

        var aComment = answerComments[id];

        if (aComment != undefined) {

            fetch('http://localhost:8080/comment/createForAnswer', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aComment, id })

            })
                .then((res) => res.json())
                .then((data) => { setX(x => !x); setLoad(load => !load); setAnswerComment(''); })
                .catch(err => console.log('Error from create answers comments : ', err))

        } else {

            alert('Comment field must be filled')

        }



    }

    const commentOnChange = (t_id, e) => {

        //setAnswerComment(answerComments.map((ans) => ans._id == t_id ? { ...ans, Comments: [...ans.Comments, e.target.value] } : ans))
        setAnswerComment({ ...answerComments, [t_id]: e.target.value })

    }

    return (

        <div className="mypost">

            <div key={id} className="voting">

                <button onClick={increasing}><img src={Up} width='10px' height='10px'></img></button>
                <h3>{votes}</h3>
                <button onClick={decreasing}><img src={Down} width='10px' height='10px'></img></button>

            </div>

            <div className="left">
                <div className="post-head">

                    <h2 className="topic">{values.title}</h2>

                    <p>
                        Asked &nbsp;: {day5.toLocaleDateString()}&nbsp;@&nbsp;{day5.toLocaleTimeString()} &nbsp; &nbsp;&nbsp;&nbsp;
                        {modified}
                        Viewed &nbsp;: {values.views}&nbsp; times &nbsp;&nbsp;&nbsp;
                    </p>

                    <hr></hr>

                </div>

                <div className="discription">

                    <h4><i>This is my problem:</i></h4>

                    <div>

                        <p className="question">{values.question}</p>

                    </div>

                    <h3 className="comment-head">Comments {qCommentArray.length}</h3>

                    <div className="commentst">

                        {

                            qCommentArray.map((comment) => {

                                return (

                                    <Comment

                                        comment={comment.Comment}
                                        createdAt={comment.updatedAt == comment.createdAt ? new Date(comment.createdAt) : new Date(comment.updatedAt)}
                                        author={comment.Author}

                                    />

                                )

                            })

                        }

                    </div>

                </div>

                <div className="questionComment">
                    <input placeholder="Comment on question ......." value={qComment} onChange={e => setQcomment(e.target.value)}></input>
                    <button onClick={handleQuestionComment}>Done</button>
                </div>

                <div className="answerst">

                    <h3>Answers {z.length}</h3>

                    <h5 className={class1}>{message}</h5>

                    {

                        z.map((a) => {

                            return (
                                <div key={a._id} className="multi-ans">
                                    <Answer
                                        key={a._id}
                                        answer={a.Answer}
                                        views={a.Views}
                                        votes={a.Votes}
                                        createdAt={new Date(a.createdAt)}
                                        author={a.Author}
                                        comment={body}
                                        id={a._id}
                                        func={answerVote}

                                    />
                                    <div className="t-answerComment">
                                        <input placeholder="Comment on answer ......." value={answerComments[a._id] || ''} onChange={e => commentOnChange(a._id, e)}></input>
                                        <button onClick={() => handlesubmit(a._id)}>Done</button>
                                    </div>



                                </div>

                            )

                        })

                    }

                    {/* <MyAnswer

                        answer="This error occurs because Strapi does not have the necessary permissions to create directories or files in the specified location (C:\Program Files). To resolve it, you should run your terminal or command prompt with administrator privileges or move your Strapi project to a directory where your user account has full write permissions, such as C:\Users\YourUserName\."
                        views={25}
                        votes={5}
                        createdAt={day5}
                        author={authors[4]}

                    />

                    <MyAnswer

                        answer="This error occurs because Strapi does not have the necessary permissions to create directories or files in the specified location (C:\Program Files). To resolve it, you should run your terminal or command prompt with administrator privileges or move your Strapi project to a directory where your user account has full write permissions, such as C:\Users\YourUserName\."
                        views={25}
                        votes={5}
                        createdAt={day5}
                        author={authors[4]}

                    />


                    <MyAnswer

                        answer="This error occurs because Strapi does not have the necessary permissions to create directories or files in the specified location (C:\Program Files). To resolve it, you should run your terminal or command prompt with administrator privileges or move your Strapi project to a directory where your user account has full write permissions, such as C:\Users\YourUserName\."
                        views={25}
                        votes={5}
                        createdAt={day5}
                        author={authors[4]}

                    /> */}

                </div>

            </div>

            <div className="right">

                <Link to="/user/ask" label="Create question">Create question</Link>

            </div>

        </div>

    );

}

export default MyPost;