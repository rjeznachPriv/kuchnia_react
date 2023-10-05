import './../Styles/InfoModalComponent.css';
import React from 'react';
import { useState } from 'react';

const { forwardRef, useRef, useImperativeHandle } = React;

const InfoModalComponent = forwardRef((props, ref) => {

    const [modalInternalClass, setModalInternalClass] = useState('');

    useImperativeHandle(ref, () => ({

        fadeOutSlow() {
            setModalInternalClass("fadeOutSlow");
        },

        fadeOut() {
            setModalInternalClass("fadeOut");
        },

        fadeIn() {
            setModalInternalClass("fadeIn");
        }
    }));

    return (
        <div className={`${props.mainWindowClassName} modal-main-window ${modalInternalClass}`}>
            <div className={`${props.mainWindowTopBarClassName} modal-top-bar`}>
                <div className={`${props.topBarXButtonClassName} modal-top-bar-x-button`} onClick={() => (props.fadeOut())}></div>
            </div>
            <div className={`${props.ContentClassName} modal-content`}>
                <h2>{props.title}</h2>
                <div className="InfoModalContentContainer">
                    <span>{props.text}</span>
                    <span className="line">{props.contentLine1}</span>
                    <span className="line">{props.contentLine2}</span>
                    <span className="line">{props.contentLine3}</span>
                    <span className="line">{props.contentLine4}</span>
                    <span className="line">{props.contentLine5}</span>
                    <span className="line">{props.contentLine6}</span>
                    <span className="line">{props.contentLine7}</span>
                    <span className="line">{props.contentLine8}</span>
                    <span className="line">{props.contentLine9}</span>
                    <span className="line">{props.contentLine10}</span>
                </div>
                <div className={`InfoModalButtons ${props.buttonsClass}`}>
                    <button className={`InfoModalButton1 ${props.button1Class}`} onClick={() => props.button1Action()}>{props.button1Text}</button>
                    <button className={`InfoModalButton2 ${props.button2Class}`} onClick={() => props.button2Action()}>{props.button2Text}</button>
                    <button className={`InfoModalButton3 ${props.button3Class}`} onClick={() => props.button3Action()}>{props.button3Text}</button>
                </div>
            </div>
        </div>
    );
});

export default InfoModalComponent;
