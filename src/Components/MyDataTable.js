import React, { useState, useEffect } from 'react';

import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import TextBoxComponent from './TextBoxComponent.js';
import AutocompleteSearchComponent, { filterItems } from './AutocompleteSearchComponent.js';
import InfoModalComponent from './InfoModalComponent.js';

import captions from "./../Configuration/LocalizedCaptionsPL.json"

function MyDataTable(props) {
    const [resourceToDeleteGuid, setResourceToDeleteGuid] = useState();
    const [resourceToEditGuid, setResourceToEditGuid] = useState();

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    //const [resourceToEditName, setResourceToEditName] = useState("");
    //const [resourceToEditAlarm, setResourceToEditAlarm] = useState(0);
    //const [resourceToAddName, setResourceToAddName] = useState("");
    //const [resourceToAddAlarm, setResourceToAddAlarm] = useState(0);

    const [itemToAddValues, setItemToAddValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [resourceClicked, setResourceClicked] = useState({ name: "" });

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    useEffect(() => {

    }, []);

    function onResourceNameClicked(guid) {
        var _resources = props.resources.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setResources(_resources);

        let clickedResource = props.resources.filter((item) => { return item.guid == guid; })[0];
        setResourceClicked(clickedResource);
        //setChooseClickedModalFadingClass('fadeIn');
        console.log('show modal with choose options. Clicked resource:', resourceClicked);
    }

    function onHeaderClicked(header) {
        console.log('header clicked!', header);
    }

    function onFiltered(phrase) {
        setFilterPhrase(phrase);
        setSearchComponentTouched(true);
    }

    function onDeleteResourceClicked(guid) {
        setResourceToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
        console.log('show delete modal', resourceToDeleteGuid);
    }

    function onEditResourceClicked(guid) {
        console.log('clicked', guid);
        setResourceToEditGuid(guid);
        //setResourceToEditName(getResource({ guid: guid }).name);
        //setResourceToEditAlarm(getResource({ guid: guid }).alarm);
        setEditModalFadingClass("fadeIn");
        //console.log('show edit modal');
    }

    function onAddResourceClicked() {
        let newItem = {
            ...itemToAddValues,
            guid: guidGenerator(),
            frequency: 0,
        };

        props.setResources(prev => [...prev, newItem]);
    }

    function getResource({ guid = null } = {}) {
        if (guid) {
            var resource = props.resources.filter((item) => item.guid == guid)[0];
            return resource ? resource : null;
        }

        return null;
    }

    function deleteResource(resource_guid) {
        //if (deleteAssignedProductsFlag) {
        //    let productsToDelete = props.products.filter((item) => (item.category_id == category_guid));
        //    let _products = props.products.filter(item => !productsToDelete.some(toRemove => toRemove.category_id == item.category_id));
        //    props.setProducts(_products);
        //}

        var _resources = props.resources.filter((item) => item.guid != resource_guid);
        props.setResources(_resources);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateResource(resourceId) {

        let resourceToUpdate = props.resources.filter((resource) => (resource.guid == resourceId))[0];

        console.log('to update:', resourceToUpdate);

        //var _resources = props.resources.map((item) => {
        //    return (item.guid == resourceId) ? {
        //        name: categoryToEditName,
        //        alarm: categoryToEditAlarm,
        //        guid: categoryToEditGuid,
        //    } : item
        //});

        //props.setResources(_resources);
        //setEditModalFadingClass('fadeOut');
        console.log('hide edit modal');
    }

    function filteredResources() {  //TODO: make sort customizable
        return filterItems(props.resources, calculateFilterPhrase(), ["alarm"]).sort((a, b) => { return b.frequency - a.frequency });
    }

    function calculateFilterPhrase() {
        return searchComponentTouched ? filterPhrase : props.filterPhrase;
    }

    function AllowCreateEntity() {
        //TODO: make it depends on IsValid
        let requiredColumnNames = props.columns.filter((col) => (col.required)).map((col) => (col.name));
        let hasEmptyRequired = requiredColumnNames.some(
            (key) => !itemToAddValues[key]
        );

        return !hasEmptyRequired;
    }

    function IsValid(column, value) {
        if (column.required && !value) return false;
        return true;
    }

    return (
        <div id={`${props.resourceName}-table`} className={`${props.resourceName}Component`}>

            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={props.deleteWindowTitle}
                text={props.deleteWindowText}
                contentLines={props.resources.filter((item) => (item.category_id == resourceToDeleteGuid)).map((item) => (item.name))}
                formLines={
                    [
                        //(
                        //    <span>
                        //        <input type="checkbox" checked={deleteAssignedProductsFlag} onChange={() => setDeleteAssignedProductsFlag(!deleteAssignedProductsFlag)}>
                        //        </input> {captions.message_remove_also_attached} {captions.message_products}
                        //    </span>
                        //)
                    ]
                }
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => { deleteResource(resourceToDeleteGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={() => setDeleteModalFadingClass("fadeOut")} >
            </InfoModalComponent>

            <InfoModalComponent
                mainWindowClassName={`modal-edit-window ${editModalFadingClass}`}
                mainWindowTopBarClassName="modal-edit-top-bar"
                topBarXButtonClassName="modal-edit-x-button"
                ContentClassName="modal-edit-content"
                title={captions.message_category_edit}
                text=""
                contentLines={[
                    //<TextBoxComponent
                    //    label={`${captions.field_category_name}:`}
                    //    value={categoryToEditName}
                    //    onChange={(e) => setCategoryToEditName(e.target.value)}
                    //></TextBoxComponent>,
                    //<TextBoxComponent
                    //    label={`${captions.field_category_alarm}:`}
                    //    type="number"
                    //    value={categoryToEditAlarm}
                    //    onChange={(e) => { setCategoryToEditAlarm(e.target.value) }}
                    //    min={0}
                    //></TextBoxComponent>
                ]
                }
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class="modal-edit-button1"
                button2Action={() => { updateResource(resourceToEditGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={() => { setEditModalFadingClass('fadeOut') }}>
            </InfoModalComponent>

            <AutocompleteSearchComponent
                onChange={onFiltered}
                value={calculateFilterPhrase()}
                items={props.resources}
            ></AutocompleteSearchComponent>

            <div className="resources-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            {props.columns.map((column) => (column.displayName ?
                                <th key={column.displayName}>
                                    <span onClick={() => onHeaderClicked(column.name)} className="clickable"> {column.displayName}</span>
                                </th> : ""
                            ))}
                        </tr>
                        <tr className="table-header">
                            {props.columns.map((column) => (column.displayName ?
                                <th key={column.name}>
                                    <TextBoxComponent
                                        id={`column-${column.name}-header`}
                                        value={itemToAddValues[column.name]}
                                        type={column.type}
                                        placeholder={`dodaj ${column.displayName}`}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setItemToAddValues(prev => ({ ...prev, [column.name]: newValue }));
                                        }}
                                        validationMessage={IsValid(column, itemToAddValues[column.name]) ? "" : "Validation Message! TODO"}
                                    />
                                </th> : ""
                            ))}

                            <th></th>
                            <th>
                                <MdAddBox
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => AllowCreateEntity() ? onAddResourceClicked() : ""}
                                    className={AllowCreateEntity() ? "" : "disabled"}>
                                </MdAddBox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResources().map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <span key={item.guid} onClick={() => onResourceNameClicked(item.guid)} className="clickable">
                                        {item.name}
                                    </span>
                                </td>
                                <td>
                                    <span>{item.alarm}</span>
                                </td>
                                <td>
                                    <FaEdit role="button" tabIndex="0" onClick={() => onEditResourceClicked(item.guid)}></FaEdit>
                                </td>
                                <td>
                                    <FaTimes role="button" tabIndex="0" onClick={() => onDeleteResourceClicked(item.guid)}></FaTimes>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyDataTable;
