import './BottomButton.css';
import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { FaAppleAlt } from 'react-icons/fa';
import { MdShelves } from 'react-icons/md';
import { MdForklift } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';



function BottomButton(props) {
    return (
        
        <a className="bottom-button">
            {/*<p className="icon">{React.createElement(props.icon)}</p>*/}
            <p className="icon">{props.icon}</p>
            <p className="caption">{props.caption}</p>
        </a>
  );
}

export default BottomButton;
