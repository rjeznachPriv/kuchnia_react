import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './../InfoModalComponent.js';
import TextBoxComponent from './../TextBoxComponent.js';
import AutocompleteSearchComponent, { filterItems, filterItems2 } from './../AutocompleteSearchComponent.js';

import ChooseWhereToGoModalComponent from './../ChooseWhereToGoModalComponent.js';

import './../../Styles/Tabs/CategoriesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

function CategoriesComponent(props) {
    const [categoryToDeleteGuid, setCategoryToDeleteGuid] = useState();
    const [categoryToEditGuid, setCategoryToEditGuid] = useState();
    const [categoryToEditName, setCategoryToEditName] = useState("");
    const [categoryToEditAlarm, setCategoryToEditAlarm] = useState(0);
    const [categoryToAddName, setCategoryToAddName] = useState("");
    const [categoryToAddAlarm, setCategoryToAddAlarm] = useState(0);

    const [categoryClicked, setCategoryClicked] = useState({ name: "" });

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');
    const [chooseClickedModalFadingClass, setChooseClickedModalFadingClass] = useState('fadeOut');

    const [deleteAssignedProductsFlag, setDeleteAssignedProductsFlag] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    var localStyle = { display: props.activeTab === names.categories_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        console.log('scan', barcode);
        // categories nioe ma barcode. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac produkt/zasób?)
    }

    function onCategoryNameClicked(guid) {
        var _categories = props.categories.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setCategories(_categories);

        let clickedCategory = props.categories.filter((item) => { return item.guid == guid; })[0];
        setCategoryClicked(clickedCategory);
        setChooseClickedModalFadingClass('fadeIn');
    }

    function onHeaderClicked(header) {
        console.log('header clicked!', header);
    }

    function onFiltered(phrase) {
        setFilterPhrase(phrase);
        setSearchComponentTouched(true);
    }
    function onDeleteCategoryClicked(guid) {
        setCategoryToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function onEditCategoryClicked(guid) {
        setCategoryToEditGuid(guid);
        setCategoryToEditName(getCategory({ guid: guid }).name);
        setCategoryToEditAlarm(getCategory({ guid: guid }).alarm);
        setEditModalFadingClass("fadeIn");
    }

    function onAddCategoryClicked() {
        var _categories = props.categories.slice();
        _categories.push({
            guid: guidGenerator(),
            name: categoryToAddName,
            alarm: categoryToAddAlarm,
            frequency: 0
        });

        props.setCategories(_categories);

        setCategoryToAddName('');
        setCategoryToAddAlarm(0);
    }

    function getCategory({ guid = null } = {}) {
        if (guid) {
            var category = props.categories.filter((item) => item.guid == guid)[0];
            return category ? category : null;
        }

        return null;
    }

    function deleteCategory(category_guid) {
        if (deleteAssignedProductsFlag) {
            let productsToDelete = props.products.filter((item) => (item.category_id == category_guid));
            let _products = props.products.filter(item => !productsToDelete.some(toRemove => toRemove.category_id == item.category_id));
            props.setProducts(_products);
        }

        var _categories = props.categories.filter((item) => item.guid != category_guid);
        props.setCategories(_categories);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateCategory(categoryId) {
        var _categories = props.categories.map((item) => {
            return (item.guid == categoryId) ? {
                name: categoryToEditName,
                alarm: categoryToEditAlarm,
                guid: categoryToEditGuid,
            } : item
        });

        props.setCategories(_categories);
        setEditModalFadingClass('fadeOut');
    }

    function filteredCategories() {
        return filterItems(props.categories, calculateFilterPhrase(), ["alarm"]);
    }

    function calculateFilterPhrase() {
        return searchComponentTouched ? filterPhrase : props.filterPhrase;
    }

    return (
        <div id="categories-tab" style={localStyle} className="CategoriesComponent">
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_category}
                text={`${captions.message_are_you_sure_to_remove_category}: ${getCategory({ guid: categoryToDeleteGuid })?.name}? ${captions.message_products_with_category_still_attached}:`}
                contentLines={props.products.filter((item) => (item.category_id == categoryToDeleteGuid)).map((item) => (item.name))}
                formLines={[(
                    <span>
                        <input type="checkbox" checked={deleteAssignedProductsFlag} onChange={() => setDeleteAssignedProductsFlag(!deleteAssignedProductsFlag)}>
                        </input> {captions.message_remove_also_attached} {captions.message_products}
                    </span>
                )]}
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => { deleteCategory(categoryToDeleteGuid) }}
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
                    <TextBoxComponent
                        label={`${captions.field_category_name}:`}
                        value={categoryToEditName}
                        onChange={(e) => setCategoryToEditName(e.target.value)}
                    ></TextBoxComponent>,
                    <TextBoxComponent
                        label={`${captions.field_category_alarm}:`}
                        type="number"
                        value={categoryToEditAlarm}
                        onChange={(e) => { setCategoryToEditAlarm(e.target.value) }}
                        min={0}
                    ></TextBoxComponent>]
                }
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class="modal-edit-button1"
                button2Action={() => { updateCategory(categoryToEditGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={() => { setEditModalFadingClass('fadeOut') }}>
            </InfoModalComponent>

            <ChooseWhereToGoModalComponent
                mainWindowClassName={`modal-where-to-go ${chooseClickedModalFadingClass}`}
                button1Text={`Pokaż produkty w ${categoryClicked.name}`}
                button1Action={() => { navigate(`/products?category=${categoryClicked.guid}`); }}
                button2Text={`Pokaż zapasy w ${categoryClicked.name}`}
                button2Action={() => { navigate(`/categories/${categoryClicked.guid}`); }}
                button3Class="none"
                fadeOut={() => { setChooseClickedModalFadingClass('fadeOut') }}

            ></ChooseWhereToGoModalComponent>
            <AutocompleteSearchComponent
                onChange={onFiltered}
                value={calculateFilterPhrase()}
                items={props.categories}
            ></AutocompleteSearchComponent>

            <div className="categories-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            <th>
                                <span onClick={() => onHeaderClicked("categoryName")} className="clickable"> {captions.field_category_name}</span>
                            </th>
                            <th>
                                <span onClick={() => onHeaderClicked("categoryAlarm")} className="clickable"> {captions.field_category_alarm}</span>
                            </th>
                        </tr>
                        <tr className="table-header">
                            <th>
                                <TextBoxComponent
                                    id={names.add_category_name_input}
                                    value={categoryToAddName}
                                    placeholder={captions.field_category_name}
                                    onChange={(e) => { setCategoryToAddName(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <TextBoxComponent
                                    id={names.add_category_alarm_input}
                                    type="number"
                                    value={categoryToAddAlarm}
                                    placeholder={captions.field_category_alarm}
                                    onChange={(e) => { setCategoryToAddAlarm(e.target.value) }}
                                    min={0}
                                ></TextBoxComponent>
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => onAddCategoryClicked()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {filteredCategories().sort((a, b) => { return b.frequency - a.frequency }).map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <span key={item.guid} onClick={() => onCategoryNameClicked(item.guid)} className="clickable">
                                        {item.name}
                                    </span>
                                </td>
                                <td>
                                    <span>{item.alarm}</span>
                                </td>
                                <td>
                                    <FaEdit role="button" tabIndex="0" onClick={() => onEditCategoryClicked(item.guid)}></FaEdit>
                                </td>
                                <td>
                                    <FaTimes role="button" tabIndex="0" onClick={() => onDeleteCategoryClicked(item.guid)}></FaTimes>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoriesComponent;
