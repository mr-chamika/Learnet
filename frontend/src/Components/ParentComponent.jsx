import React, { useState } from 'react';
import PopUp from './PopUp/PopUp';

const ParentComponent = () => {
    const [showPopUp, setShowPopUp] = useState(false);

    const handleOpenPopUp = () => {
        setShowPopUp(true);
    };

    const handleClosePopUp = () => {
        setShowPopUp(false);
    };

    return (
        <div>
            <button onClick={handleOpenPopUp}>Open Pop-Up</button>
            <PopUp show={showPopUp} onClose={handleClosePopUp}>
                <h2>Pop-Up Content</h2>
                <p>This is the content of the pop-up window.</p>
            </PopUp>
        </div>
    );
};

export default ParentComponent;
