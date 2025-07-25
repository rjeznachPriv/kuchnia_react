import React, { useState, useEffect } from 'react';

import guidGenerator from 'guid-generator';

import { FaEdit, FaTimes, FaSortDown, FaSortUp, FaCamera } from 'react-icons/fa';

import { MdAddBox } from 'react-icons/md';

import TextBoxComponent from './TextBoxComponent.js';
import DropDownComponent, { getSelectableFieldLabel } from './DropDownComponent.js';
import AutocompleteSearchComponent, { filterItems } from './AutocompleteSearchComponent.js';
import InfoModalComponent from './InfoModalComponent.js';

import captions from "./../Configuration/LocalizedCaptionsPL.json"

function MyDataTable(props) {
    const [resourceToDeleteGuid, setResourceToDeleteGuid] = useState();
    const [resourceToEditGuid, setResourceToEditGuid] = useState();

    const [sortColumn, setSortColumn] = useState("frequency");
    const [sortDirection, setSortDirection] = useState(true);

    const [deleteAssignedResourcesFlag, setDeleteAssignedResourcesFlag] = useState(false);

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    const [itemToAddValues, setItemToAddValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [itemToEditValues, setItemToEditValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    useEffect(() => {

    }, []);

    function onResourceFieldClicked(guid, columnName) {
        var _resources = props.resources.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setResources(_resources);

        let clickedResource = props.resources.filter((item) => { return item.guid == guid; })[0];
        props.onResourceClicked(clickedResource, columnName);
    }

    function onHeaderClicked(header) {
        // TODO: introduce another column field (sortable)
        setSortDirection(sortColumn == header ? !sortDirection : sortDirection);
        setSortColumn(header);
    }

    function onFiltered(phrase) {
        setFilterPhrase(phrase);
        setSearchComponentTouched(true);
    }

    function onDeleteResourceClicked(guid) {
        setResourceToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function onEditResourceClicked(guid) {
        setResourceToEditGuid(guid);
        setItemToEditValues(getResource(guid));
        setEditModalFadingClass("fadeIn");
    }

    function onAddResourceClicked() {
        let newItem = {
            ...itemToAddValues,
            guid: guidGenerator(),
            frequency: 0,
        };

        props.setResources(prev => [...prev, newItem]);
    }

    function getResource(guid) {
        if (guid) {
            var resource = props.resources.filter((item) => item.guid == guid)[0];
            return resource ? resource : null;
        }

        return { name: "", type: "text" }
    }

    function deleteResource(resource_guid) {
        if (deleteAssignedResourcesFlag) {
            for (var dependantResourcesType of props.dependantResources) {
                dependantResourcesType.setter(dependantResourcesType.data.filter((ent) => (ent[dependantResourcesType.column] != resource_guid)));
            }
        }

        var _resources = props.resources.filter((item) => item.guid != resource_guid);
        props.setResources(_resources);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateResource(resourceId) {
        var _resources = props.resources.map((item) => {
            return (item.guid == resourceId) ? itemToEditValues : item
        });

        props.setResources(_resources);
        setEditModalFadingClass('fadeOut');
    }

    function filteredResources() {
        let searchableColumns = props.columns.filter((column) => (column.searchable)).map((column) => (column.name));
        let columnWithDataSource = props.columns.filter((column) => (column.dataSource))[0];    //TODO: what if more columns? : push more to keyPhrase

        let extendedResources = props.resources.map((item) => ({ ...item, keyPhrase: getSelectableFieldLabel(columnWithDataSource, item) }));
        searchableColumns.push("keyPhrase");

        return filterItems(extendedResources, calculateFilterPhrase(), searchableColumns).sort((a, b) => {
            let columnType = props.columns.filter((column) => (column.name == sortColumn))[0]?.type || "text";
            if (columnType == "text") {
                return sortDirection ? b[sortColumn].localeCompare(a[sortColumn]) : a[sortColumn].localeCompare(b[sortColumn]);
            }
            if (columnType == "number") {
                return sortDirection ? b[sortColumn] - a[sortColumn] : a[sortColumn] - b[sortColumn];
            }
            //TODO: implement here for other types
            return 0;
        });
    }

    function calculateFilterPhrase() {
        return searchComponentTouched ? filterPhrase : props.initialFilterPhrase;
    }

    function EntityStateValid(entity) {
        let columnsToValidate = props.columns.filter((column) => (column.validation));
        let validationResult = columnsToValidate.map((column) => (IsInvalid(column, entity[column.name])));
        return !validationResult.some((item) => (item != false));
    }

    function IsInvalid(column, value) {
        if (column.validation?.required && !value) return column.validation?.required_message;
        if (typeof column.validation?.min !== 'undefined' && value < column.validation.min) return column.validation?.min_message;
        if (typeof column.validation?.max !== 'undefined' && value > column.validation.max) return column.validation?.max_message;
        // TODO: implement here for other types
        // TODO: sum messages, rather than returning separately
        return false;
    }

    function columnsToShow() {
        return props.columns.filter((column) => (column.displayName));
    }

    function valuesToSearchFor() {
        let searchableColumns = props.columns.filter((col) => (col.searchable == true));

        let results = [];
        for (var column of searchableColumns) {
            results.push(...(props.resources.map((item) => (item[column.name]))));
            if (column.dataSource) {
                results.push(...(column.dataSource.map((row) => (row.name))));
            }
        }

        return results;
    }

    function renderFieldComponent(column, value, valueSetter, withLabel = false) {
        function scannableButton(column) {
            return column.scannable ? (
                <FaCamera role="button" tabIndex="0" onClick={() => props.onScannerIconClicked()}></FaCamera>
            ) : "";
        };

        function setValue(newValue) {
            valueSetter(prev => ({ ...prev, [column.name]: newValue }));
        };

        const commonProps = {
            value: value,
            validationMessage: IsInvalid(column, value),
            label: withLabel ? column.displayName : "",
            onChange: (e) => setValue(e.target.value),
        };


        switch (column.type) {
            case "text":
            case "number":
                return (
                    <span>
                        <TextBoxComponent
                            {...commonProps}
                            placeholder={`TODO dodaj ${column.displayName}`}
                            type={column.type}
                            min={column.min}
                            max={column.max}
                            className={column.scannable ? "inline-table" : ""}
                        />
                        {scannableButton(column)}
                    </span>
                );

            case "select":
                return (
                    <DropDownComponent
                        {...commonProps}
                        handleChange={(e) => setValue(e.target.value)}
                        options={column.dataSource}
                        selectedId={value}
                    ></DropDownComponent>
                );
            //TODO: implement here for other types

            default:
                return <div>Nieobs³ugiwany typ: {column.type}</div>;
        }
    }

    return (
        <div id={`${props.resourceName}-table`} className={`${props.resourceName}Component`}>

            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={props.deleteWindowTitle}
                text={`${props.deleteWindowText} ${getResource(resourceToDeleteGuid)?.name}?`}
                formLines={
                    [
                        props.dependantResources ?
                            (
                                <span>
                                    <input
                                        type="checkbox"
                                        checked={deleteAssignedResourcesFlag}
                                        onChange={() => setDeleteAssignedResourcesFlag(!deleteAssignedResourcesFlag)}>
                                    </input> {captions.message_remove_also_attached} {props.dependantResourcesNames.join(", ")}
                                </span>
                            ) : ""
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
                title={props.editWindowTitle}
                text=""
                contentLines={
                    columnsToShow().map((column) => (
                        renderFieldComponent(column, itemToEditValues[column.name], setItemToEditValues, true)
                    ))
                }
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class={`modal-edit-button1 ${EntityStateValid(itemToEditValues) ? "" : "disabled"}`}
                button2Action={() => EntityStateValid(itemToEditValues) ? updateResource(resourceToEditGuid) : ""}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={() => { setEditModalFadingClass('fadeOut') }}>
            </InfoModalComponent>

            <AutocompleteSearchComponent
                onChange={onFiltered}
                value={calculateFilterPhrase()}
                items={valuesToSearchFor()}
            ></AutocompleteSearchComponent>

            <div className="resources-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            {props.columns.map((column) => (column.displayName ?
                                <th key={column.displayName}>
                                    <span
                                        onClick={() => onHeaderClicked(column.name)}
                                        className="clickable">
                                        {column.displayName} {column.name == sortColumn ?
                                            (sortDirection ? <FaSortDown /> : <FaSortUp />) :
                                            ""}
                                    </span>
                                </th> : ""
                            ))}
                        </tr>
                        <tr className="table-header">
                            {props.columns.map((column) => (column.displayName ?
                                <th key={column.name}>
                                    {renderFieldComponent(column, itemToAddValues[column.name], setItemToAddValues)}
                                </th> : ""
                            ))}

                            <th></th>
                            <th>
                                <MdAddBox
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => EntityStateValid(itemToAddValues) ? onAddResourceClicked() : ""}
                                    className={EntityStateValid(itemToAddValues) ? "" : "disabled"}>
                                </MdAddBox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResources().map((item) => (
                            <tr className="item" key={item.guid}>
                                {columnsToShow().map((column) => (
                                    <td key={column.name}>
                                        <span onClick={() => onResourceFieldClicked(item.guid, column.name)} className="clickable">
                                            {["text", "number"].includes(column.type) && (
                                                <span> {item[column.name]}</span>
                                            )}
                                            {column.type === "select" && (
                                                <span>{getSelectableFieldLabel(column, item)}</span>
                                            )}
                                            {column.type === "img" && (
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                ></img>
                                            )}
                                        </span>

                                    </td>
                                ))}
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
