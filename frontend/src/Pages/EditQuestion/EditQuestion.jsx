const { useState, useEffect, useContext } = require('../../../react_lite/createDOM');
const { routerContext } = require('../../Router/Router');
import './EditQuestion.css';
import { UserContext } from '../../Contexts/UserContext';

const EditQuestion = () => {

    const { goto } = useContext(routerContext);

    const { user } = useContext(UserContext)

    const { params } = useContext(routerContext);
    const { id } = params;

    const [values, setValues] = useState({
        title: "how to delete from database",
        question: "mehemai machan kohomda mongo db eken record ekk delete karanne",
        expectation: "",
        tarray: []
    });

    useEffect(() => {

        fetch(`http://localhost:8080/post/getOne`, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                authorization: `bearer ${user.token}`

            },
            body: JSON.stringify({ id })

        })
            .then(res => res.json())
            .then(data => { setValues({ title: data.data.title, question: data.data.question, expectation: data.data.expectation, tarray: data.data.tarray }); })
            .catch((error) => console.log("ERROR in edit : ", error));

    }, [id])

    //Error handling
    const [titleEmptyEr, setTitleEmptyEr] = useState(false);
    const [titleMaxEr, setTitleMaxEr] = useState(false);
    const [tagsEr, setTagsEr] = useState(false);
    const [questionEr, setQuestionEr] = useState(false);
    const [expectEr, setExceptEr] = useState(false);
    const [notagsEr, setNoTagsEr] = useState(false);

    const handleArray = (e) => {

        const tagsArray = (e.target.value.endsWith(',') ? e.target.value.slice(0, -1) : e.target.value).split(",").map(tag => tag.trim());
        setValues({ ...values, tarray: tagsArray, updatedAt: new Date() });

    }


    const handleSubmit = (event) => {

        event.preventDefault();

        if (values.tarray[0].length == 0 || values.tarray.length > 5 || values.title.trim().length == 0 || values.question.length < 500 || values.expectation.trim().length == 0 || values.title.length > 30) {

            if (values.tarray.length > 5) { setTagsEr(true); setNoTagsEr(false) } else { setTagsEr(false); }
            if (values.title.trim().length == 0) { setTitleEmptyEr(true); setTitleMaxEr(false) } else { setTitleEmptyEr(false); }
            if (values.question.length < 500) { setQuestionEr(true) } else { setQuestionEr(false) }
            if (values.expectation.trim().length == 0) { setExceptEr(true) } else { setExceptEr(false) }
            if (values.title.length > 30) { setTitleEmptyEr(false); setTitleMaxEr(true) } else { setTitleMaxEr(false) }
            if (values.tarray[0].length === 0) { setTagsEr(false); setNoTagsEr(true) } else { setNoTagsEr(false) }

        } else {

            fetch("http://localhost:8080/post/update", {

                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user.token}`

                },
                body: JSON.stringify({ values, id })

            })
                .then(() => { goto("/user/myquestions"); })
                .catch(error => console.log('case case from update frontend', error));

        }


    }

    return (
        <div className='edit-question'>
            <form className="formPage" onSubmit={handleSubmit}>

                <div className="content">
                    <div className="left">
                        <div className="field">

                            <label className="title">Title</label>
                            <p>Briefly describe the question that another user can understand. Use maximum 30 characters.</p>
                            <input className="title-inputs" name="title" value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} placeholder="Enter new title .........." type="text" max={30}></input>
                            {titleEmptyEr && (<span className='span'>*Title can not be empty*</span>)}
                            {titleMaxEr && (<span className='span'>*Title can have only max 30 characters*</span>)}

                        </div>

                        <div className="field">

                            <label className="question">Question</label>
                            <p>Describe the title you entered above and mention what you need to solve.</p>
                            <textarea className="text1" name="question" value={values.question} onChange={(e) => setValues({ ...values, question: e.target.value })} placeholder="Enter new question .........." rows="15" cols="138"></textarea>
                            {questionEr && (<span className='span'>*Question must have at least 500 characters*</span>)}
                        </div>
                    </div>
                    <div className="right">

                        <div className="field">

                            <label className="tags">Tags</label>

                            <input className="tags-inputs" name="tarray" value={values.tarray} onChange={handleArray} placeholder="Maximum 5 tags" rows="15" cols="138"></input>
                            {tagsEr && (<span className='span'>*Max number of tags is 5*</span>)}
                            {notagsEr && (<span className='span'>*A question must have at least 1 Tag*</span>)}

                        </div>

                        <div className="field">

                            <label className="question-expect">Expectation</label>
                            <p>Write what you are expecting from the answer.</p>
                            <textarea className="text" name="expectation" value={values.expectation} onChange={(e) => { setValues({ ...values, expectation: e.target.value }) }} placeholder='Update ..........' rows="5" cols="138"></textarea>
                            {expectEr && (<span className='span'>*Expectation can not be empty*</span>)}
                        </div>

                        {/*<div className="field">

    <label>Select tag(s)</label>
    <br></br>
    <div className="tagArea">
        <div className='tag-1'>

            <Tag name="Academic Programs" val="javascript"></Tag>
            <Tag name="Library & Resources" val="javascript"></Tag>
            <Tag name="Student Support Services" val="javascript"></Tag>
            <Tag name="Health & Wellness" val="javascript"></Tag>

        </div>

        <div className='tag-2'>

            <Tag name="Workshops & Seminars" val="javascript"></Tag>
            <Tag name="Research Conferences" val="javascript"></Tag>
            <Tag name="Online Learning" val="javascript"></Tag>
            <Tag name="Internship Programs" val="javascript"></Tag>

        </div>

        <div className='tag-2'>

            <Tag name="Computer Science" val="javascript"></Tag>
            <Tag name="Medicine & Health Sciences" val="javascript"></Tag>
            <Tag name="Law & Legal Studies" val="javascript"></Tag>
            <Tag name="Art & Design" val="javascript"></Tag>

        </div>

    </div>
</div>*/}

                        {/*<div className='postMethod'>

    <label>Post as </label>

    <select className='as-button' name="method" value={method} onChange={(e) => { setAs(e.target.value) }}>

        <option value="public">Public</option>
        <option value="private">Private</option>

    </select>

</div> */}
                    </div>
                </div>
                <div className='but-wrap'>
                    <button className='question-submits' type="submit">Submit</button>
                </div>
            </form>

        </div>

    );

}

export default EditQuestion;