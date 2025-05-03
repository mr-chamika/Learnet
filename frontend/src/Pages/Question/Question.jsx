const { useState, useContext, useEffect } = require('../../../react_lite/createDOM');
const { formDataToObj } = require('../../Util/FormDataToObj');
import './Question.css';
import Icon from '../../Assets/Question/person.png';
import { routerContext } from '../../Router/Router';
import { UserContext } from '../../Contexts/UserContext';

const Question = () => {

    const { goto } = useContext(routerContext);

    const { user } = useContext(UserContext)

    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [expectation, setExpectation] = useState("");
    const [tagString, setTagString] = useState("");


    //Error handling
    const [titleEmptyEr, setTitleEmptyEr] = useState(false);
    const [titleMaxEr, setTitleMaxEr] = useState(false);
    const [tagsEr, setTagsEr] = useState(false);
    const [questionEr, setQuestionEr] = useState(false);
    const [expectEr, setExceptEr] = useState(false);
    const [notagsEr, setNoTagsEr] = useState(false);

    const handleSubmit = (event) => {

        event.preventDefault();

        const t = tagString.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

        if ((tagString.trim().length == 0) || t.length > 5 || title.trim().length == 0 || question.length < 500 || expectation.trim().length == 0 || title.length > 30) {

            if (t.length > 5) { setTagsEr(true); setNoTagsEr(false) } else { setTagsEr(false); }
            if (title.trim().length == 0) { setTitleEmptyEr(true); setTitleMaxEr(false) } else { setTitleEmptyEr(false); }
            if (question.length < 500) { setQuestionEr(true) } else { setQuestionEr(false) }
            if (expectation.trim().length == 0) { setExceptEr(true) } else { setExceptEr(false) }
            if (title.length > 30) { setTitleEmptyEr(false); setTitleMaxEr(true) } else { setTitleMaxEr(false) }
            if (tagString.trim().length == 0) { setTagsEr(false); setNoTagsEr(true) } else { setNoTagsEr(false) }

        } else {

            setExceptEr(false); setExpectation(false); setNoTagsEr(false); setQuestion(false); setQuestionEr(false); setTagsEr(false);

            fetch("http://localhost:8080/post/create", {

                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    authorization: `bearer ${user.token}`

                },
                body: JSON.stringify({ title, question, expectation, tarray: t })

            })
                .then(() => { goto(`/user/forum`); window.location.reload(); })
                .catch(error => console.log('case case ', error));

        }


    }

    return (
        <div className='ask-question'>
            <form className="formPage" onSubmit={handleSubmit}>

                <div className="content">
                    <div className="left">
                        <div className="field">

                            <label className="title">Title</label>
                            <p>Briefly describe the question that another user can understand. Use maximum 30 characters.</p>
                            <input className="title-inputs" name="title" value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="Enter your title .........." type="text" max={30}></input>
                            {titleEmptyEr && (<span className='span'>*Title can not be empty*</span>)}
                            {titleMaxEr && (<span className='span'>*Title can have only max 30 characters*</span>)}

                        </div>

                        <div className="field">

                            <label className="question">Question</label>
                            <p>Describe the title you entered above and mention what you need to solve.</p>
                            <textarea className="text1" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question .........." rows="15" cols="138"></textarea>
                            {questionEr && (<span className='span'>*Question must have at least 500 characters*</span>)}
                        </div>
                    </div>
                    <div className="right">

                        <div className="field">

                            <label className="tags">Tags</label>
                            <input className="tags-inputs" name="tagString" value={tagString} onChange={e => setTagString(e.target.value)} placeholder="Maximum 5 tags" rows="15" cols="138"></input>
                            {tagsEr && (<span className='span'>*Max number of tags is 5*</span>)}
                            {notagsEr && (<span className='span'>*A question must have at least 1 Tag*</span>)}

                        </div>

                        <div className="field">

                            <label className="question-expect">Expectation</label>
                            <p>Write what you are expecting from the answer.</p>
                            <textarea className="text" name="expectation" value={expectation} onChange={(e) => { setExpectation(e.target.value) }} placeholder='Write ..........' rows="5" cols="138"></textarea>
                            {expectEr && (<span className='span'>*Expectation can not be empty*</span>)}
                        </div>

                    </div>
                </div>

                <div className='but-wrap'>
                    <button className='question-submits' type="submit">Submit</button>
                </div>
            </form>
        </div>

    );

}

export default Question;