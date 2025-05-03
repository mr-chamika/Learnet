import Link from '../../../Router/Link';
import { useEffect, useState, useContext } from '../../../../react_lite/createDOM';
import { postContext } from '../../../Contexts/postContext';
import './MyAnswer.css';
import Icon from '../../../Assets/check.png';
import Comment from '../../Comment/Comment';
import Up from '../../../Assets/up-arrow.png';
import Down from '../../../Assets/down-arrow.png';

const MyAnswer = ({ answer, views, votes, createdAt, author, comment, id, func, addC }) => {

    const { load, setLoad } = useContext(postContext);

    const [correct, setCorrect] = useState(false);

    const [AcommentArray, setAcommentArray] = useState([]);

    //const url = `/profile/:id = ${author.id}, name = ${author.name}, age = ${author.age}`;

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

    const changeColor = () => { setCorrect(!correct) };

    useEffect(() => {

        fetch('http://localhost:8080/comment/getAnswersComment', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })

        })
            .then((res) => res.json())
            .then((data) => { setAcommentArray(data.data) })
            .catch(err => console.log('Error from get answers comments : ', err))


    }, [load, id])

    return (

        <div className='myanswer-block'>
            <div className='wrap'>

                <div className="voting">

                    <button onClick={() => func(id, 1)}><img src={Up} width='10px' height='10px'></img></button>
                    <h3>{votes}</h3>
                    <button onClick={() => func(id, -1)}><img src={Down} width='10px' height='10px'></img></button>
                    <br></br>
                    <br></br>
                    <button onClick={changeColor} className='tik' style={`background-color:${!correct ? 'white' : '#56ff56'}`}><img src={Icon} width='17px' height='21px' ></img></button>

                </div>

                <div className='m-left'>
                    <p className='answer'>{answer}</p>

                    <div className='answer-block-bottom'>
                        {author == "chamika" && (<div className='buttons'>
                            <button>Edit</button>
                            <button>Delete</button>
                            <button>Share</button>
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

                            <Comment
                                key={comment._id}
                                comment={comment.Comment}
                                createdAt={comment.updatedAt == comment.createdAt ? new Date(comment.createdAt) : new Date(comment.updatedAt)}
                                author={comment.Author}

                            />

                        )

                    })

                }

            </div>

            {/* <div key={id} className="answerComment">
                <input key={id} placeholder="Comment on answer ......." value={aComment} onChange={e => setAnswerComment(e.target.value)}></input>
                <button onClick={handleAnswerComment}>Done</button>
            </div> */}

        </div>

    );

};

export default MyAnswer;