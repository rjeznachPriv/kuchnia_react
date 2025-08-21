import React, { useState, useEffect } from 'react';
import { useAppSettingsStore } from "./../../utils/appSettingsStore.js";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './../../Styles/InteractiveDataTable/InteractiveDataTable.css';

import pl from "date-fns/locale/pl";    //TODO: from settings

import { FaEdit, FaTimes, FaSortDown, FaSortUp } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import { } from './../../utils/utils.js';
import { Create, Read, Update, Delete, filterBySearchPhraseAndSort, EntityStateValid } from './crud';
import Draggable from './../Draggable.js';

import { renderFieldComponent } from './../Form/fieldComponent.js';

import { getSelectableFieldLabel } from './../DropDownComponent.js';
import CheckBoxComponent from './../CheckBoxComponent.js';
import AutocompleteSearchComponent from './../AutocompleteSearchComponent.js';
import { getSmartSelectableFieldLabel } from './../SmartDropDownComponent.js';
import InfoModalComponent from './../InfoModalComponent.js';
import JustCameraComponent from './../JustCameraComponent.js';
import JustScannerComponent from './../JustScannerComponent.js';
import { columnsWhenGroupped } from './Filters/Group.js';
import { columnsWhenSpoiled } from './Filters/Spoiled.js';
import { columnsWhenNotMuch } from './Filters/NotMuch.js';

import captions from "./../../Configuration/LocalizedCaptionsPL.json"
import noImagePath from "./../../img/noImage.png";

let imgSetter;
let codeSetter;
function InteractiveDataTable(props) {
    const { appSettings, setAppSettings } = useAppSettingsStore();

    const [resourceToDeleteGuid, setResourceToDeleteGuid] = useState();
    const [resourceToEditGuid, setResourceToEditGuid] = useState();

    const [sortColumn, setSortColumn] = useState("frequency");
    const [sortDirection, setSortDirection] = useState(true);

    const [deleteAssignedResourcesFlag, setDeleteAssignedResourcesFlag] = useState(false);

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');
    const [cameraModalFadingClass, setCameraModalFadingClass] = useState('fadeOut');
    const [scannerModalFadingClass, setScannerModalFadingClass] = useState('fadeOut');

    const [activeFilter, setActiveFilter] = useState('');

    const [itemToAddValues, setItemToAddValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [itemToEditValues, setItemToEditValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    useEffect(() => {
        registerLocale("pl", pl);   //TODO: register locale from settings
    }, []);

    function onResourceFieldClicked(guid, columnName) {
        var _resources = props.resources.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: (item.frequency || 0) + 1 } :
                item;
        });
        props.setResources(_resources);

        let clickedResource = props.resources.filter((item) => { return item.guid == guid; })[0];
        props.onResourceClicked(clickedResource, columnName);
    }

    function onHeaderClicked(column) {
        if (column.sortable) {
            setSortDirection(sortColumn == column.name ? !sortDirection : sortDirection);
            setSortColumn(column.name);
        }
    }

    function onDeleteResourceClicked(guid) {
        setResourceToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function onEditResourceClicked(guid) {
        setResourceToEditGuid(guid);
        setItemToEditValues(Read(props.resources, guid));
        setEditModalFadingClass("fadeIn");
    }

    function onCameraIconClicked(setter) {
        setCameraModalFadingClass("fadeIn");
        imgSetter = setter;
    }

    function onScannerIconClicked(setter) {
        setScannerModalFadingClass("fadeIn");
        codeSetter = setter;
    }

    function onRemoveThumbNailButtonClicked(setter) {
        setter(undefined);
    }

    function onFiltered(phrase) {
        setFilterPhrase(phrase);
        setSearchComponentTouched(true);
    }

    function calculateFilterPhrase() {
        return searchComponentTouched ? filterPhrase : props.initialFilterPhrase;
    }

    function columnsToShow() {
        let columns = props.columns.filter((column) => (column.displayName));
        columns = columnsWhenGroupped(activeFilter, columns);
        columns = columnsWhenSpoiled(activeFilter, columns);
        columns = columnsWhenNotMuch(activeFilter, columns);
        //TODO: add more here
        return columns;
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

    function pictureTakenCallback(picture) {
        imgSetter && imgSetter(picture);
    }

    function codeScannedCallback(code) {
        codeSetter && codeSetter(code);
    }

    function prepareResourcesToDisplay() {
        let resourcesAfterCustomFilters = activeFilter ? activeFilter.predicate(...activeFilter.predicateArgs) : props.resources;
        return filterBySearchPhraseAndSort(resourcesAfterCustomFilters, props.columns, sortColumn, sortDirection, appSettings.dateFormat?.value, calculateFilterPhrase());
    }

    return (
        <div id={`${props.resourceName}-table`} className={`${props.resourceName}Component InteractiveDataTable`}>

            <Draggable>
                <JustCameraComponent
                    className={cameraModalFadingClass}
                    setClassName={setCameraModalFadingClass}
                    callback={pictureTakenCallback}
                ></JustCameraComponent>
            </Draggable>

            <Draggable>
                <JustScannerComponent
                    className={scannerModalFadingClass}
                    setClassName={setScannerModalFadingClass}
                    callback={codeScannedCallback}
                    quagga={props.quagga}
                ></JustScannerComponent>
            </Draggable>

            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={props.deleteWindowTitle}
                text={`${props.deleteWindowText} ${Read(props.resources, resourceToDeleteGuid)?.name || ""}?`}
                formLines={
                    [
                        props.dependantResources ?
                            (
                                <CheckBoxComponent
                                    value={deleteAssignedResourcesFlag}
                                    onChange={() => setDeleteAssignedResourcesFlag(!deleteAssignedResourcesFlag)}
                                    label={`${captions.message_remove_also_attached} ${props.dependantResourcesNames.join(", ")}`}
                                ></CheckBoxComponent>
                            ) : ""
                    ]
                }
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => {
                    Delete(props.resources, props.setResources, resourceToDeleteGuid, deleteAssignedResourcesFlag, props.dependantResources);
                    setDeleteModalFadingClass("fadeOut");
                }}
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
                        renderFieldComponent(column, itemToEditValues[column.name], setItemToEditValues, true, onScannerIconClicked, onRemoveThumbNailButtonClicked, onCameraIconClicked, appSettings)
                    ))
                }
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class={`modal-edit-button1 ${EntityStateValid(itemToEditValues, props.columns) ? "" : "disabled"}`}
                button2Action={
                    () => {
                        if (EntityStateValid(itemToEditValues, props.columns)) {
                            Update(props.resources, props.setResources, itemToEditValues, resourceToEditGuid);
                            setEditModalFadingClass('fadeOut');
                        }
                    }
                }
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

            {props.customFilters?.map((filter) => {
                return (

                    <button
                        onClick={() => { activeFilter == filter ? setActiveFilter(undefined) : setActiveFilter(filter) }}
                        className={activeFilter == filter ? "selected" : ""}
                    >{filter.icon} {filter.caption}</button>
                )
            }
            )}

            <div className="resources-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            {columnsToShow().map((column) => (column.displayName ?
                                <th key={column.displayName}>
                                    <span
                                        onClick={() => onHeaderClicked(column)}
                                        className={column.sortable ? "clickable" : ""} >
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
                                    {renderFieldComponent(column, itemToAddValues[column.name], setItemToAddValues, false, onScannerIconClicked, onRemoveThumbNailButtonClicked, onCameraIconClicked, appSettings)}
                                </th> : ""
                            ))}
                            {activeFilter?.name == "group" ? <th></th> : ""}
                            {activeFilter?.name == "notMuch" ? <> <th></th><th></th></> : ""}
                            <th></th>
                            <th>
                                <MdAddBox
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => EntityStateValid(itemToAddValues, props.columns) ? Create(itemToAddValues, setItemToAddValues, props.setResources) : ""}
                                    className={EntityStateValid(itemToAddValues, props.columns) ? "" : "disabled"}>
                                </MdAddBox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {prepareResourcesToDisplay().map((item) => (
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
                                            {column.type === "smartselect" && (
                                                <span title={item[column.name]}>{getSmartSelectableFieldLabel(column, item)}</span>
                                            )}
                                            {column.type === "img" && (
                                                (item.img ? <img
                                                    className="tableRowImage"
                                                    src={item.img}
                                                    alt={item.name}
                                                ></img> : <img
                                                    className="tableRowImage"
                                                    src={noImagePath}
                                                    alt={item.name}
                                                ></img>)

                                            )}
                                            {column.type === "datetime" && (
                                                <span> {item[column.name]?.toString() || ""}</span>
                                            )}
                                            {column.type === "bool" && (
                                                <span>
                                                    {item[column.name] ? column.trueData : column.falseData}
                                                </span>
                                            )}

                                            {/*TODO: implement here for other types */}
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

export default InteractiveDataTable;
