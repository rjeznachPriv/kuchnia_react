import React from 'react';
import { useState, useEffect, useRef } from 'react';
import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './InfoModalComponent.js';
import TextBoxComponent from './TextBoxComponent.js';
import AutocompleteSearchComponent from './AutocompleteSearchComponent.js';

import './../Styles/StoragesComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import data from "./../Configuration/InitialData.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

function StoragesComponent(props) {

    const [storages, setStorages] = useState(data.storages);    //TODO: read from individual profile
    const [storagesToDisplay, setStoragesToDisplay] = useState(storages);

    const [storageToDeleteGuid, setStorageToDeleteGuid] = useState();
    const [storageToEditGuid, setStorageToEditGuid] = useState();
    const [storageToEditName, setStorageToEditName] = useState();
    const [storageToEditBarcode, setStorageToEditBarcode] = useState();
    const [storageToAddName, setStorageToAddName] = useState();
    const [storageToAddBarcode, setStorageToAddBarcode] = useState();

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
            label={`${captions.field_barcode}:`}
            value={storageToEditBarcode}
            onChangeValue={(e) => { setStorageToEditBarcode(e.target.value) }}
        ></TextBoxComponent>
    );

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    useEffect(() => {
        currentState.current = {
            'storages': storages,
            'editModalFadingClass': editModalFadingClass,
            'props': props
        };
    }, [storages, editModalFadingClass, props]);

    var localStyle = { display: props.activeTab === names.storages_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        if (isEditing()) {
            setStorageToEditBarcode(barcode);
        } else if (IsAdding() == true) {
            setStorageToAddBarcode(barcode);
        } else if (IsStorageTabActive()) {
            var guid = getStorage({ barcode: barcode })?.guid;
            if (guid)
                onStorageNameClicked(guid);
            else {
                // nie ma takiego kodu w bazie schowkow. Przejdz do CHOOSE?
            }
        }
    }

    function onStorageNameClicked(guid) {   //call also when scanned

        var _storages = storages.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        setStorages(_storages);
        setStoragesToDisplay(_storages);
        //setEditModalFadingClass('fadeOut'); //?
        ///setStoragesToDisplay(_storages);

        console.log('Move to "Zapasy" with Supplies filtered by storage of id:' + guid);
    }

    function onFiltered(items) {
        setStoragesToDisplay(items);
    }


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
        setStorageToEditBarcode(getStorage({ guid: guid }).barcode);
        setStorageToEditName(getStorage({ guid: guid }).name);
        setEditModalFadingClass("fadeIn");
    }

    function getStorage({ guid = null, barcode = null } = {}) {
        if (guid) {
            var storage = storages.filter((item) => item.guid == guid)[0];
            return storage ? storage : null;
        }
        if (barcode) {
            var storage = storages.filter((item) => item.barcode == barcode)[0];
            return storage ? storage : null;
        }

        return null;
    }

    function deleteStorage(guid) {
        var _storages = storages.filter((item) => item.guid != guid);
        setStorages(_storages);
        setStoragesToDisplay(_storages);
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
        setStoragesToDisplay(_storages);
    }

    function addStorage() {
        var _storages = storages.slice();
        _storages.push({
            guid: guidGenerator(),
            name: storageToAddName,
            barcode: storageToAddBarcode
        });

        setStorages(_storages);

        setStorageToAddName('');
        setStorageToAddBarcode('');
        setStoragesToDisplay(_storages);
    }

    function IsStorageTabActive() {
        return currentState.current.props.activeTab == "storages_tab";
    }
    function IsAdding() {
        return document.activeElement.id == names.add_storage_barcode_input || document.activeElement.id == names.add_storage_name_input;
    }
    function isEditing() {
        return currentState.current.props.activeTab == "storages_tab" && currentState.current.editModalFadingClass == "fadeIn";
    }

    return (
        <div id="storages-tab" style={localStyle} className="StoragesComponent">
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_storage}
                text={`${captions.message_are_you_sure_to_remove_storage}: ${getStorage({ guid: storageToDeleteGuid })?.name}?`}
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
            [Zliczac uzycia i pozycjonowac wedlug tego]
            [Dodac barcode window (male okienko z aparatu)]
            <AutocompleteSearchComponent
                callback={onFiltered}
                items={storages}
            ></AutocompleteSearchComponent>
            <div className="storages-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            <th>{captions.field_storage_name}</th>
                            <th>{captions.field_barcode}</th>
                        </tr>
                        <tr className="table-header">
                            <th>
                                <TextBoxComponent
                                    id={names.add_storage_name_input}
                                    value={storageToAddName}
                                    placeholder={captions.field_storage_name}
                                    onChangeValue={(e) => { setStorageToAddName(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <TextBoxComponent
                                    id={names.add_storage_barcode_input}
                                    value={storageToAddBarcode}
                                    placeholder={captions.field_barcode}
                                    onChangeValue={(e) => { setStorageToAddBarcode(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => addStorage()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {storagesToDisplay.sort((a, b) => { return b.frequency - a.frequency }).map((item) => (     
                            <tr className="item" key={item.guid}>
                                <td>
                                    <a key={item.guid}
                                        id={item.id}
                                        onClick={() => onStorageNameClicked(item.guid)}>
                                        {item.name}
                                    </a></td>
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
        </div>
    );
}

export default StoragesComponent;
