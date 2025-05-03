import img from '../../Assets/groupIcon.svg';
import Img2 from '../../Assets/p-icon.png';
import Block from '../../Components/Block/Block';
import Link from '../../Router/Link';
import './Forum.css';
import Approved from '../../Assets/approved.png';
import { useContext, useEffect, useState } from '../../../react_lite/createDOM';
import { UserContext } from '../../Contexts/UserContext';
import { routerContext } from '../../Router/Router';

const Forum = () => {

    const { user } = useContext(UserContext);
    const { goto } = useContext(routerContext)

    const [keyword, setKeyword] = useState('');


    //getting user role.......

    const userId = user.userId;

    const [role, setRole] = useState(false);
    const [posts, setPosts] = useState([]);

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
        fetch('http://localhost:8080/post/get', {

            method: "POST",
            headers: {

                authorization: `bearer ${user.token}`,

            }
        })
            .then(res => res.json())
            .then(data => { if (data.data) { setPosts(data.data) } else if (data.message) { console.log(data.message) }; })
            .catch(error => console.log('Error from post get : ', error));
    }, [user])


    const searching = (e) => {

        e.preventDefault();

        if (keyword.trim().length !== 0) {

            goto(`/user/search/${keyword.trim().split(' ')[0]}`);

        } else {

            alert('Please enter a keyword')

        }

    }

    return (

        <div className='forum'>
            <div className="header-f">
                <h1>Recommended Questions</h1>

                <form className='searching' onSubmit={searching}>

                    <input name='keyword' type='text' value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
                    <button className='search-but' type='submit'>Search</button>

                </form>

                <div className='buts'>
                    {/* <button className="role" onClick={changeRole}>{AdminorUser}</button> */}
                    <div className='button-x'><img className="button-image" src={Img2} /><Link className='text' to='/user/myquestions'>My Questions</Link></div>
                    <div className='button-y'><img className="button-image" src={img} /><Link className='text' to='/user/ask'>Ask New Question</Link></div>
                </div>
            </div>


            <div className='f-content'>
                <div className='list'>
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

};

export default Forum;