import './Block.css';
import Button from '../../Components/Button/Button';
import Link from '../../Router/Link';
import bubble from '../../Assets/comment.png';

const Block = ({ views, answers, title, set, votes, createdAt, author, question, id, updatedAt, hidden, role, markedCount, comments }) => {

    var now = new Date();

    var createdAt = new Date(createdAt)
    var updatedAt = new Date(updatedAt)

    var compare = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate(), createdAt.getHours(), createdAt.getMinutes(), createdAt.getSeconds());

    var path = `/user/post/${id}`;

    const subTitle = question.substring(0, 250) + ' ....';

    var diff = now - compare; // Get the difference in milliseconds.
    var ago = '';

    if (diff < 0) {
        ago = "Invalid date"; // Handle the case where createdAt is later than now (actually that is not possible :-).
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

    var classname = (role && hidden) ? 'block-blocked' : 'block';

    var mark = markedCount > 0 ? 'marked' : '';

    return (

        <div className={classname}>

            <div className='left'>

                <a><Link className='navsp' to={path}>{title}</Link></a>

                <p className='underTitle'>{subTitle}</p>

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

            <div className='right'>
                <div className="shows">
                    <div className='navsk'>{views}&nbsp;Views</div>
                    <div className={`navsk answer ${mark}`}>{answers}&nbsp;Answers</div>
                    <div className='navsk'>{votes}&nbsp;Votes</div>
                </div>
                <div className="bottom">
                    <div className='com'>

                        <img src={bubble} width='20' height='20' />
                        <p>{comments}</p>

                    </div>
                    <div className='authorT'>

                        <p><a>{author}</a>&nbsp; asked {ago}&nbsp;ago</p>

                    </div>

                </div>

            </div>


        </div>

    );

};

export default Block;