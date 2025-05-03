import './Invite.css';
import Link from '../../../Router/Link';
import Gmail from '../../../Assets/Invitation/gmail.png';
import Background from './mail.png';

const Invite = () => {

    return (

        <div className='new'>

            <img className='back' src={Background} width='400' height='400'></img>

            <div className='heading'>

                <h1>Invite your friends to explore together </h1>
                <hr></hr>

            </div>

            <div className='search-bar'>

                <label>Search your friend already exists</label>
                <input placeholder="Enter Gmail or Name...." type='text'></input>
                <button>Search</button>

            </div>
            <div className="invitation">

                <label>Invite via email</label>
                <input placeholder="Enter Gmail...." type='text'></input>
                <div className="i-button">

                    <img src={Gmail} width="30" height='30'></img>
                    <Link className='i-link' to='/gmailPortal' >Send Invite</Link>

                </div>

            </div>

            <a><Link to='/user/premium' label="Need to invite multiple friends ?">Need to invite multiple friends ?</Link></a>


        </div>

    );

}

export default Invite;