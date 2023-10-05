import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

import InfoModalComponent from './InfoModalComponent.js';
import TextBoxComponent from './TextBoxComponent.js';

import './../Styles/StoragesComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import data from "./../Configuration/InitialData.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

function StoragesComponent(props) {

    const [storages, setStorages] = useState(data.storages);
    const [storageToDeleteGuid, setStorageToDeleteGuid] = useState();
    const [storageToEditGuid, setStorageToEditGuid] = useState();
    const [storageToEditName, setStorageToEditName] = useState();
    const [storageToEditBarcode, setStorageToEditBarcode] = useState();
    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    const currentState = useRef();

    const nameTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_storage_name}:`}
            value={storageToEditName}
            onChangeValue={(e) => { setStorageToEditName(e.target.value) }}
        ></TextBoxComponent>
    );

    const barcodeTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_barcode}:` }
            value={storageToEditBarcode}
            onChangeValue={(e) => { setStorageToEditBarcode(e.target.value) }}
        ></TextBoxComponent>
    );

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditing);
    }, []);

    useEffect(() => {
        currentState.current = {
            'editModalFadingClass': editModalFadingClass,
            'setStorageToEditBarcode': setStorageToEditBarcode,
            'props': props
        };
    }, [editModalFadingClass, setStorageToEditBarcode, props]);

    function onBarcodeScannedWhenEditing(barcode) {
        if (isEditing()) {
            console.log(`setStorageToEditBarcode ${barcode}`);
            setStorageToEditBarcode(barcode);
        } else if (IsStorageTabActive()) {
            //TODO: open supplies("zapasy") tab with filtered supplies from this storage
            console.log(`otwieram zakladke zapasy dla schowka: ${barcode}`);
        }
    }

    var localStyle = { display: props.activeTab === names.storages_tab ? 'block' : 'none' };

    function hideDeleteModal() {
        setDeleteModalFadingClass("fadeOut");
    }

    function hideEditModal() {
        setEditModalFadingClass('fadeOut');
    }

    function showDeleteModal(guid) {
        setStorageToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function showEditModal(guid) {
        setStorageToEditGuid(guid);
        setStorageToEditBarcode(getStorage(guid).barcode);
        setStorageToEditName(getStorage(guid).name);
        setEditModalFadingClass("fadeIn");
    }

    function getStorage(guid) {
        var storage = storages.filter((item) => item.guid == guid)[0];
        return storage ? storage : undefined;
    }

    function deleteStorage(guid) {
        var storagesToKeep = storages.filter((item) => item.guid != guid);
        setStorages(storagesToKeep);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateStorage(storageId) {
        var _storages = storages.map((item) => {
            return (item.guid == storageId) ? {
                name: storageToEditName,
                guid: storageToEditGuid,
                barcode: storageToEditBarcode
            } : item
        });

        setStorages(_storages);
        setEditModalFadingClass('fadeOut');
    }

    function IsStorageTabActive() {
        return currentState.current.props.activeTab == "storages_tab"
    }

    function isEditing() {
        return currentState.current.props.activeTab == "storages_tab" && currentState.current.editModalFadingClass == "fadeIn" ;
    }

    return (
        <div id="storages-tab" style={localStyle} className="StoragesComponent">
            {props.activeTab}
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_storage}
                text={`${captions.message_are_you_sure_to_remove_storage}: ${getStorage(storageToDeleteGuid)?.name}?`}
                content=""
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => { deleteStorage(storageToDeleteGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={hideDeleteModal}>
            </InfoModalComponent>

            <InfoModalComponent
                mainWindowClassName={`modal-edit-window ${editModalFadingClass}`}
                mainWindowTopBarClassName="modal-edit-top-bar"
                topBarXButtonClassName="modal-edit-x-button"
                ContentClassName="modal-edit-content"
                title={captions.message_storage_edit}
                text=""
                contentLine1={nameTextBoxComponent}
                contentLine2={barcodeTextBoxComponent}
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class="modal-edit-button1"
                button2Action={() => { updateStorage(storageToEditGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={hideEditModal}>
            </InfoModalComponent>
            Dodac barcode
            Klikniecie w schowek otworzy jego zawartosc
            <p>SZUKAJKA</p>
            <table>
                <thead>
                    <tr>
                        <th>{captions.field_storage_name}</th>
                        <th>{captions.field_barcode}</th>
                        <th>{captions.message_edit}</th>
                        <th>{captions.message_delete}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="item"><td>Input na nazwe nowego schowka</td><td></td><td>PLUSIK</td></tr>
                    {storages.map((item) => (
                        <tr className="item" key={item.guid}>
                            <td>{item.name}</td>
                            <td>{item.barcode}</td>
                            <td>
                                <FaEdit role="button" tabIndex="0" onClick={() => showEditModal(item.guid)}></FaEdit>
                            </td>
                            <td>
                                <FaTimes role="button" tabIndex="0" onClick={() => showDeleteModal(item.guid)}></FaTimes>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoragesComponent;
