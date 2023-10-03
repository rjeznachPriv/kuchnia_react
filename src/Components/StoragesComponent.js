import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

import './../Styles/StoragesComponent.css';
import names from "./../Configuration/VitalHTMLids.json";

function StoragesComponent(props) {

    var localStyle = { display: props.activeTab === names.storages_tab_button ? 'block' : 'none' };

    function handleEditStorage(guid) {

    }

    function handleDeleteStorage(guid) {

    }


    return (
        <div id="storages-tab" style={localStyle} className="StoragesComponent">
            <p>SZUKAJKA</p>
                {props.storages.length > 0 ? (
                    <ul>
                        {props.storages.map((item) => (
                            <li className="item" key={item.guid}>
                                <label>{item.name}</label>
                                <FaEdit role="button" tabIndex="0" onClick={() => handleEditStorage(item.guid)}></FaEdit>
                                <FaTimes role="button" tabIndex="0" onClick={() => handleDeleteStorage(item.guid)}></FaTimes>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items!</p>

                )}

        </div>
    );
}

export default StoragesComponent;
