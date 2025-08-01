import React, { useState, useEffect } from 'react';

import InfoModalComponent from './InfoModalComponent.js';

import './../Styles/ChooseWhereToGoModalComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

// a ten modal pojawia sie po kliknieciu w link

const ChooseWhereToGoModalComponent = (props, ref) => {
    let [chooseActionModalFadingClass, setChooseActionModalFadingClass] = useState(props.chooseClickedModalFadingClass);

    useEffect(() => {

    }, []);

    function hideModal() {
        props.fadeOut();
    }

    return (
        <div className="ChooseWhereToGoComponent">
            <InfoModalComponent
                mainWindowClassName={props.mainWindowClassName}
                mainWindowTopBarClassName="modal-choose-action-top-bar"
                topBarXButtonClassName="modal-choose-action-x-button"
                ContentClassName="modal-choose-action-content"
                title={captions.message_choose_action}
                text={captions.message_choose_what_to_do}
                content=""
                button1Text={props.Button1Text}
                button1Class="modal-choose-action-button1"
                button1Action={() => props.button1Action()}
                button2Text={props.Button2Text}
                button2Class="modal-choose-action-button2"
                button2Action={() => props.button2Action()}
                button3Text={props.Button3Text}
                button3Class={props.button3Class}
                button3Action={() => props.button3Action()}
                fadeOut={hideModal}>
            </InfoModalComponent>
        </div>
    );
};

export default ChooseWhereToGoModalComponent;