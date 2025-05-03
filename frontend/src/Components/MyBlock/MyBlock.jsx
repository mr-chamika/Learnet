import './MyBlock.css';
import Button from '../Button/Button';
import Link from '../../Router/Link';
import { useContext } from '../../../react_lite/createDOM';
import { routerContext } from '../../Router/Router';
import { postContext } from '../../Contexts/postContext';
import { UserContext } from '../../Contexts/UserContext';

const MyBlock = ({ /* views, answers, */ title, set, /* votes, */ createdAt, author, /* verify, */ id, question, hidden }) => {

    const { user } = useContext(UserContext)

    const editUrl = `/user/edit/${id}`;//send id to editquestion.jsx
    /* const { goto } = useContext(routerContext);

    const { load, setLoad } = useContext(postContext); */

    //var now = new Date();
    /*  const url = `/profile/:id = ${author.id}, name = ${author.name}, age = ${author.age}`;
     const url_title = `/post/:title = ${title}`; */

    const subTitle = question.substring(0, 250) + ' ....';

    var path = `/user/post/${id}`;

    //if (!verify) { path = `/user/post/${id}` } else { path = `/user/mypost/${id}` };

    /* var diff = now.getFullYear() - createdAt.getFullYear();
    var ago = (diff) + " years(s)";

    if (diff == 0) {//created at same year

        diff = now.getMonth() - createdAt.getMonth();
        ago = (now.getMonth() - createdAt.getMonth()) + " month(s)";

        if (diff == 0) {//created at same month

            diff = now.getDate() - createdAt.getDate();
            ago = (now.getDate() - createdAt.getDate()) + " day(s)";

            if (diff == 0) {//created at same day

                diff = now.getHours() - createdAt.getHours();
                ago = (now.getHours() - createdAt.getHours()) + " hour(s)";

                if (diff == 0) {//created at same hour

                    diff = now.getMinutes() - createdAt.getMinutes();
                    ago = (now.getMinutes() - createdAt.getMinutes()) + " min(s)";

                    if (diff == 0) {//created at same minute

                        diff = now.getSeconds() - createdAt.getSeconds();
                        ago = (now.getSeconds() - createdAt.getSeconds()) + " second(s)";

                    }

                }

            }

        }

    } */

    const deletePost = async () => {


        const confirm = prompt(`Confirm Delete "${title}" post by entering DELETE`);

        if (confirm === 'DELETE') {

            await fetch(`http://localhost:8080/post/`, {

                'method': "DELETE",
                'body': JSON.stringify({ id }),
                'headers': {

                    authorization: `bearer ${user.token}`

                }

            })
                .then(res => res.json())
                .then((data) => { if (data.message) { console.log(data.message) } window.location.reload() })
                .catch((error) => { console.log("ERROR", error) })

        } else {

            alert(`Confirmation failed. "${title}" post delete unsuccessfull`)

        }

    }

    return (

        <div className='myblock'>

            {/* <div className='left'>

                <a className='navs'><Link to='/forum/views' label='Viewed'>Viewed&nbsp;{views}</Link></a>
                <a className='navs'><Link to='/forum/answered' label='Answered'>Answered</Link>&nbsp;{answers}</a>
                <a className='navs'><Link to='/forum/voted' label='Voted'>Voted</Link>&nbsp;{votes}</a>


            </div> */}

            <div className='right'>

                <div className='top-line'>

                    <div className='t-wrap'>

                        <a className='my-title'><Link to={path}>{title}</Link></a>{hidden && (<span className='hidden'> (Reported)</span>)}

                    </div>

                    <div className='wrapper'>
                        <div className='top-buttons'>

                            <button className='editm'><a><Link to={editUrl}>Edit</Link></a></button>
                            <button className='deletem' onClick={deletePost}>Delete</button>

                        </div>
                    </div>

                </div>
                <p className='underTitle'>{subTitle}</p>
                <div>

                    <div className='buttons'>

                        {

                            set.map((item) => {

                                return (

                                    <div>

                                        <Button

                                            tag={item}

                                        />
                                    </div>
                                )

                            })

                        }

                    </div>
                </div>
                {/* <div className='authorTime'>

                    <p><a href={url}>{author}</a>&nbsp; asked {ago}&nbsp;ago</p>

                </div> */}

            </div>

        </div>



    );

};

export default MyBlock;