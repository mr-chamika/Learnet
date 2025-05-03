import './PremiumCard.css';
import Link from '../../Router/Link';

const PremiumCard = ({ title, price, color, features }) => {

    return (

        <div className="card" style={`background-color: ${color};`}>
            <div className='card-top'>
                <h2 className='title'>{title}</h2>

                <div className='price'>
                    <h1>Rs.{price}</h1>
                    <h6>/month</h6>

                </div>
            </div>

            <div className='card-features'>

                <ol>

                    {

                        features.map((item) => {

                            return (<li>{item}</li>)
                        })
                    }
                </ol>

            </div>

            <div className='card-button'>

                <a><Link to='/user/premium' label="Get started">Buy Now</Link></a>{/* to='paymentPortal' */}

            </div>

        </div>

    );

}

export default PremiumCard;