import './Searched.css'
import { useContext, useEffect, useState } from '../../../react_lite/createDOM';
import { UserContext } from '../../Contexts/UserContext';
import img from '../../Assets/groupIcon.svg';
import Img2 from '../../Assets/p-icon.png';
import Link from '../../Router/Link';
import Block from '../../Components/Block/Block';

const Searched = () => {

    const { user } = useContext(UserContext);

    const parts = window.location.pathname.split('/')

    const keyword = parts[3];

    //getting user role.......

    const userId = user.userId;

    const [role, setRole] = useState(false);
    const [posts, setPosts] = useState([]);
    const [msg, setMsg] = useState('No search results');

    useEffect(() => {

        fetch('http://localhost:8080/user/get-onec', {

            method: "POST",
            headers: {

                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })

        })
            .then((res) => res.json())
            .then((data) => {

                if (data.user.isModerator) {

                    setRole(true);
                    return;

                }

                if (data.user.isAdmin) {

                    setRole(true);
                    return;
                }


            })
            .catch((error) => console.log('Getting user role error : ', error));

    }, [user])


    useEffect(() => {

        fetch('http://localhost:8080/post/search', {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
                'authorization': `bearer ${user.token}`

            },
            body: JSON.stringify({ keyword })

        })
            .then((res) => res.json())
            .then((data) => { if (data.data) { setPosts(data.data) } else if (data.message) { setMsg(data.message) } })
            .catch((error) => console.log(error))


    }, [])

    return (

        <div className='search'>
            <div className="top">
                <h1>Searching : {keyword}</h1>

                <div className='buts'>
                    {/* <button className="role" onClick={changeRole}>{AdminorUser}</button> */}
                    <div className='button-x'><img className="button-image" src={Img2} /><Link className='text' to='/user/myquestions'>My Questions</Link></div>
                    <div className='button-y'><img className="button-image" src={img} /><Link className='text' to='/user/ask'>Ask New Question</Link></div>
                </div>
            </div>


            <div className='search-content'>
                <div className='list'>
                    {posts.length == 0 &&
                        (<div className='display'> {msg} </div>)

                    }
                    {
                        posts.map((post) => {
                            return (
                                <div>
                                    {(!post.isHidden || role) &&

                                        (

                                            <div>
                                                <Block
                                                    answers={post.answers}
                                                    title={post.title}
                                                    views={post.views}
                                                    set={post.tarray}
                                                    votes={post.votes}
                                                    createdAt={post.createdAt}
                                                    updatedAt={post.updatedAt}
                                                    author={post.author}
                                                    question={post.question}
                                                    id={post._id}
                                                    hidden={post.isHidden}
                                                    role={role}
                                                    markedCount={post.markedCount}
                                                    comments={post.comments}
                                                />
                                            </div>

                                        )
                                    }
                                </div>

                            )

                        })
                    }
                </div>

            </div>

        </div>

    );


}

export default Searched;