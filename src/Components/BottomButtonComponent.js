import './../Styles/BottomButtonComponent.css';
import React from 'react';

function BottomButtonComponent(props) {
    var className = `bottom-button${props.footerProps.active === props.id ? ' active' : ''}`;

    return (

        <a className={className} onClick={ () => props.footerProps.onBottomButtonClick(props.id) }>
            <p className="icon">{props.icon}</p>
            <p className="caption">{props.caption}</p>
        </a>
  );
}

export default BottomButtonComponent;
