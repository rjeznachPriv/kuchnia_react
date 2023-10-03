import './../Styles/InfoModalComponent.css';
import React from 'react';

function InfoModalComponent(props) {

    return (

        <div className={ `${props.mainWindowClassName} modal-main-window`}>
            <div className={ `${props.mainWindowTopBarClassName} modal-top-bar`}>
                <div className={ `${props.topBarXButtonClassName} modal-top-bar-x-button`} onClick={() => (props.onCloseClicked)}></div>
            </div>
        </div>
    );
}

export default InfoModalComponent;
