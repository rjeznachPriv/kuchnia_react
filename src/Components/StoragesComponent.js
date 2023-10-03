import React from 'react';
import { useState } from 'react';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

import './../Styles/StoragesComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import data from "./../Configuration/InitialData.json";


function StoragesComponent(props) {
    const [storages, setStorages] = useState(data.storages);

    var localStyle = { display: props.activeTab === names.storages_tab_button ? 'block' : 'none' };

    function handleEditStorage(guid) {

    }

    function handleDeleteStorage(guid) {
        console.log(guid);
        const storagesToKeep = storages.filter((item) => item.guid != guid);
        setStorages(storagesToKeep);
    }


    return (
        <div id="storages-tab" style={localStyle} className="StoragesComponent">
            <p>SZUKAJKA</p>
            <table>
                <thead>
                    <tr>
                        <th>Nazwa Schowka</th>
                        <th>Edytuj</th>
                        <th>Usuñ</th>
                    </tr>
                </thead>
                <tbody>
                    {storages.map((item) => (
                        <tr className="item" key={item.guid}>
                            <td>{item.name}</td>
                            <td>
                                <FaEdit role="button" tabIndex="0" onClick={() => handleEditStorage(item.guid)}></FaEdit>
                            </td>
                            <td>
                                <FaTimes role="button" tabIndex="0" onClick={() => handleDeleteStorage(item.guid)}></FaTimes>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoragesComponent;
