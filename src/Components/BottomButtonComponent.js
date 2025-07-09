import './../Styles/BottomButtonComponent.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

function BottomButtonComponent(props) {
  const navigate = useNavigate();    
  var className = `bottom-button${props.active ? ' active' : ''}`;

    function handleClick(e){
        navigate(props.targetUrl);
    }

    return (

        <a className={className} onClick={ handleClick }>
            <p className="icon">{props.icon}</p>
            <p className="caption">{props.caption}</p>
        </a>
  );
}

export default BottomButtonComponent;
