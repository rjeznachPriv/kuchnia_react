import React from 'react';
import { useState, useEffect, useRef } from 'react';
import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './../InfoModalComponent.js';
import TextBoxComponent from './../TextBoxComponent.js';
import AutocompleteSearchComponent from './../AutocompleteSearchComponent.js';

import './../../Styles/Tabs/StoragesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

function StoragesComponent(props) {

    //const [storagesToDisplay, setStoragesToDisplay] = useState(props.storages);

    const [storageToDeleteGuid, setStorageToDeleteGuid] = useState();
    const [storageToEditGuid, setStorageToEditGuid] = useState();
    const [storageToEditName, setStorageToEditName] = useState();
    const [storageToEditBarcode, setStorageToEditBarcode] = useState();
    const [storageToAddName, setStorageToAddName] = useState();
    const [storageToAddBarcode, setStorageToAddBarcode] = useState();

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    const currentState = useRef();

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    useEffect(() => {
        currentState.current = {
            'storages': props.storages,
            'editModalFadingClass': editModalFadingClass,
            'props': props
        };
    }, [props.storages, editModalFadingClass, props]); // props, props.storages ?

    var localStyle = { display: props.activeTab === names.storages_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        if (isEditingStorage()) {
            setStorageToEditBarcode(barcode);
        } else if (IsAddingStorage()) {
            setStorageToAddBarcode(barcode);
        } else if (IsStoragesTabActive()) {
            var guid = getStorage({ barcode: barcode })?.guid;
            if (guid)
                onStorageNameClicked(guid);
            else {
                // nie ma takiego kodu w bazie schowkow. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac artykul lub schowek)
            }
        }
    }

    function onStorageNameClicked(guid) {

        var _storages = props.storages.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setStorages(_storages);
        //setStoragesToDisplay(_storages);

        console.log('Move to "Zapasy" with Supplies filtered by storage of id:' + guid);
    }

    function onBarcodeClicked(barcode) {
        //move to barcode generator with this code
    }

    function onFiltered(items) {
        //setStoragesToDisplay(items);
        console.log('set items', items);
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
            var storage = props.storages.filter((item) => item.guid == guid)[0];
            return storage ? storage : null;
        }
        if (barcode) {
            var storage = props.storages.filter((item) => item.barcode == barcode)[0];
            return storage ? storage : null;
        }

        return null;
    }

    function deleteStorage(guid) {
        //TODO: display warning ! IF removed storage, then what? Attach all left supplies to some 'uncategorized'? Or delete all these supplies?
        alert('Todo: implement warning window here. Reattach or remove children nodes');

        var _storages = props.storages.filter((item) => item.guid != guid);
        props.setStorages(_storages);
        //setStoragesToDisplay(_storages);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateStorage(storageId) {
        var _storages = props.storages.map((item) => {
            return (item.guid == storageId) ? {
                name: storageToEditName,
                guid: storageToEditGuid,
                barcode: storageToEditBarcode
            } : item
        });

        props.setStorages(_storages);
        setEditModalFadingClass('fadeOut');
        //setStoragesToDisplay(_storages);
    }

    function addStorage() {
        var _storages = props.storages.slice();
        _storages.push({
            guid: guidGenerator(),
            name: storageToAddName,
            barcode: storageToAddBarcode,
            frequency: 0
        });

        props.setStorages(_storages);

        setStorageToAddName('');
        setStorageToAddBarcode('');
        //setStoragesToDisplay(_storages);
    }

    function IsStoragesTabActive() {
        return currentState.current.props.activeTab == names.storages_tab;
    }

    function IsAddingStorage() {
        return document.activeElement.id == names.add_storage_barcode_input || document.activeElement.id == names.add_storage_name_input;
    }

    function isEditingStorage() {
        return currentState.current.props.activeTab == names.storages_tab && currentState.current.editModalFadingClass == "fadeIn";
    }

    return (
        <div id={names.storages_tab} style={localStyle} className="StoragesComponent">
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
                contentLines={[
                    <TextBoxComponent
                        label={`${captions.field_storage_name}:`}
                        value={storageToEditName}
                        onChange={(e) => { setStorageToEditName(e.target.value) }}
                    ></TextBoxComponent>,
                    <TextBoxComponent
                        label={`${captions.field_barcode}:`}
                        value={storageToEditBarcode}
                        onChange={(e) => { setStorageToEditBarcode(e.target.value) }}
                    ></TextBoxComponent>
                ]}
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
            [Dodac barcode window (male okienko z aparatu)]
            <AutocompleteSearchComponent
                callback={onFiltered}
                items={props.storages}
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
                                    onChange={(e) => { setStorageToAddName(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <TextBoxComponent
                                    id={names.add_storage_barcode_input}
                                    value={storageToAddBarcode}
                                    placeholder={captions.field_barcode}
                                    onChange={(e) => { setStorageToAddBarcode(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => addStorage()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {props.storages.sort((a, b) => { return b.frequency - a.frequency }).map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <a key={item.guid}
                                        id={item.id}
                                        onClick={() => onStorageNameClicked(item.guid)}>
                                        {item.name}
                                    </a></td>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onBarcodeClicked(item.barcode)}>
                                        {item.barcode}
                                    </a>
                                </td>
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
