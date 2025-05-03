import "./Button.css";
import Link from '../../Router/Link';

const Button = ({ tag }) => {

    return (

        <div>

            <button className="cat-button">

                {/* <a><Link to="/user/forum">{tag}</Link></a> */}
                {tag}

            </button>

        </div>

    );

};

export default Button;