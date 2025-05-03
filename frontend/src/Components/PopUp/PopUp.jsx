import './PopUp.css';

const PopUp = ({ show, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="cpopup-overlay">
            <div className="cpopup-content">

                {children}

            </div>
        </div>
    );
};

export default PopUp;
