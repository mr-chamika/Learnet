import './Tag.css';

const Tag = ({ name }) => {

    return (

        <div className="tag">

            {/* <input type="radio" value={val} /> */}
            <label>{name}</label>

        </div>

    );

}

export default Tag;