import { useContext } from '../../../react_lite/createDOM';
import { UserContext } from '../../Contexts/UserContext';
import './Comment.css';

const Comment = ({ comment, createdAt, author, editComment, fun_d, userId }) => {

    const { user } = useContext(UserContext)

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

    return (

        <div className='c-comment'>

            <div className='comment-top'>

                <p>{comment}</p>

            </div>

            <div className='comment-bottom'>

                {userId === user.userId && (<div className='buttons'>
                    <button onClick={editComment}>Edit</button>
                    <button onClick={fun_d}>Delete</button>
                </div>)}
                <div className='p'>
                    <p><a href='/user/profile-page'>{author}</a>&nbsp;{ago}&nbsp;ago</p>
                </div>
            </div>


        </div>

    );

}

export default Comment;