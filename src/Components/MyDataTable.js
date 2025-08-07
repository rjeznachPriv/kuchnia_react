import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../Styles/MyDataTable.css";
import { parse, isValid, format } from "date-fns";

import pl from "date-fns/locale/pl";

import { FaEdit, FaTimes, FaSortDown, FaSortUp, FaCamera } from 'react-icons/fa';
import { CiBarcode } from "react-icons/ci";
import { MdAddBox } from 'react-icons/md';
import { IoMdCloseCircle } from "react-icons/io";

import { } from './../utils/utils';
import { Create, Read, Update, Delete, filteredResources, EntityStateValid, IsInvalid } from './../utils/crud';

import TextBoxComponent from './TextBoxComponent.js';
import DropDownComponent, { getSelectableFieldLabel } from './DropDownComponent.js';
import CheckBoxComponent from './CheckBoxComponent.js';
import AutocompleteSearchComponent, { filterItems } from './AutocompleteSearchComponent.js';
import SmartDropDownComponent, { getSmartSelectableFieldLabel } from './SmartDropDownComponent.js';
import InfoModalComponent from './InfoModalComponent.js';

import captions from "./../Configuration/LocalizedCaptionsPL.json"

import noImagePath from "./../img/noImage.png";
import CameraComponent2 from './CameraComponent2.js';

let imgSetter;
function MyDataTable(props) {
    let dateFormat = "dd/MM/yyyy";  //TODO: take from locale settings!

    const [resourceToDeleteGuid, setResourceToDeleteGuid] = useState();
    const [resourceToEditGuid, setResourceToEditGuid] = useState();

    const [sortColumn, setSortColumn] = useState("frequency");
    const [sortDirection, setSortDirection] = useState(true);

    const [deleteAssignedResourcesFlag, setDeleteAssignedResourcesFlag] = useState(false);

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');
    const [cameraModalFadingClass, setCameraModalFadingClass] = useState('fadeOut');

    const [itemToAddValues, setItemToAddValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [itemToEditValues, setItemToEditValues] = useState(() =>
        Object.fromEntries(props.columns.map(field => [field.name, ""]))
    );

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    useEffect(() => {
        registerLocale("pl", pl);
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

    function safeDate(value) {
        const parsedDate = parse(value, dateFormat, new Date());
        return isValid(parsedDate) ? parsedDate : null
    }

    function pictureTakenCallback(picture) {
        imgSetter(picture);
    }

    function renderFieldComponent(column, value, valueSetter, withLabel = false) {
        function scannableButton(column) {
            return column.scannable ? (
                <CiBarcode className="font-size-large" role="button" tabIndex="0" onClick={() => props.onScannerIconClicked()}></CiBarcode>
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
                    <span className="display-flex">
                        <TextBoxComponent
                            {...commonProps}
                            placeholder={`${captions.message_add} ${column.displayName}`}
                            type={column.type}
                            min={column.min}
                            max={column.max}
                            additional={scannableButton(column)}
                        />
                    </span>
                );
            case "smartselect":
                return (
                    <span className="display-flex">
                        <SmartDropDownComponent
                            {...commonProps}
                            options={column.dataSource}
                            onSelect={(selectedItem) => {
                                setValue(selectedItem.guid);
                            }}
                            additional={scannableButton(column)}
                        />
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
            case "img":
                return (
                    <div>
                        <label>{withLabel ? column.displayName : ""}</label>
                        {
                            value ?
                                <div className="TakenPictureThumbnailContainer">
                                    <img alt="" src={value} className="TakenPictureThumbnail"></img>
                                    <div className="top-bar-x-button button" onClick={() => onRemoveThumbNailButtonClicked(setValue)}>
                                        <IoMdCloseCircle></IoMdCloseCircle>
                                    </div>
                                </div> :
                                <FaCamera role="button" tabIndex="0" onClick={() => onCameraIconClicked(setValue)}></FaCamera>
                        }
                    </div>
                );
            case "datetime":
                return (
                    <div>
                        <label>{withLabel ? column.displayName : ""}</label>
                        <DatePicker
                            selected={safeDate(value)}
                            onChange={(date) => { setValue(format(date, dateFormat)); }}
                            validationMessage={IsInvalid(column, value)}
                            dateFormat={dateFormat}
                            locale="pl"
                            showYearDropdown
                        />
                    </div>
                );
            case "bool":
                return (
                    <CheckBoxComponent
                        {...commonProps}
                        onChange={(e) => { setValue(!value); }}
                    ></CheckBoxComponent>
                );
            //TODO: implement here for other types

            default:
                return <div>{captions.message_unhandled_type} {column.type}</div>;
        }
    }

    return (
        <div id={`${props.resourceName}-table`} className={`${props.resourceName}Component`}>

            <CameraComponent2
                className={cameraModalFadingClass}
                setClassName={setCameraModalFadingClass}
                callback={pictureTakenCallback}
            ></CameraComponent2>

            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={props.deleteWindowTitle}
                text={`${props.deleteWindowText} ${Read(props.resources,resourceToDeleteGuid)?.name || ""}?`}
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
                        renderFieldComponent(column, itemToEditValues[column.name], setItemToEditValues, true)
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

            <div className="resources-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            {props.columns.map((column) => (column.displayName ?
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
                                    {renderFieldComponent(column, itemToAddValues[column.name], setItemToAddValues)}
                                </th> : ""
                            ))}

                            <th></th>
                            <th>
                                <MdAddBox
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => EntityStateValid(itemToAddValues, props.columns) ? Create(itemToAddValues, setItemToAddValues, props.setResources ) : ""}
                                    className={EntityStateValid(itemToAddValues, props.columns) ? "" : "disabled"}>
                                </MdAddBox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResources(props.resources, props.columns, sortColumn, sortDirection, dateFormat, calculateFilterPhrase()).map((item) => (
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
