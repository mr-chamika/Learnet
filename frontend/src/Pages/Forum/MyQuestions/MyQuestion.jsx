import { useState, useEffect, useContext } from "../../../../react_lite/createDOM";
import Link from "../../../Router/Link";
import Approved from '../../../Assets/approved.png'
import MyBlock from "../../../Components/MyBlock/MyBlock";

import './MyQuestions.css';
import { UserContext } from "../../../Contexts/UserContext";

const MyQuestions = () => {

    const [posts, setPosts] = useState([]);

    const { user } = useContext(UserContext)

    useEffect(() => {

        fetch('http://localhost:8080/post/getmy', {

            method: "POST",
            headers: {

                authorization: `bearer ${user.token}`

            }
        })

            .then(res => res.json())
            .then(data => { if (data.data) { setPosts(data.data) } else if (data.message) { console.log(data.message) }; })
            .catch(error => console.log('case case ', error));
    }, [user])

    return (

        <div className='my-forum-wrap'>
            <div className='my-forum'>

                <div className="header-f">

                    <h1>Your Questions</h1>
                    <div className="top"><div className='button-x'><Link className='text' to='/user/ask'>Ask New Question</Link></div></div>

                </div>


                <div className='f-content'>
                    <div className='list'>

                        {

                            posts.map((post) => {

                                return (
                                    <div>
                                        <MyBlock

                                            answers={post.answers}
                                            title={post.title}
                                            views={post.views}
                                            set={post.tarray}
                                            votes={post.votes}
                                            createdAt={new Date(post.createdAt)}
                                            author={post.isMine ? "chamika" : "unknown"}
                                            verify={post.isMine}
                                            id={post._id}
                                            question={post.question}
                                            hidden={post.isHidden}

                                        />
                                    </div>

                                )

                            })

                        }
                    </div>

                </div>

            </div >

        </div>

    );

}

export default MyQuestions;