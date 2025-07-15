import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './../InfoModalComponent.js';
import TextBoxComponent from './../TextBoxComponent.js';
import AutocompleteSearchComponent, { filterItems } from './../AutocompleteSearchComponent.js';

import ChooseWhereToGoModalComponent from './../ChooseWhereToGoModalComponent.js';

import './../../Styles/Tabs/CategoriesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

function CategoriesComponent(props) {

    const [categoryToDeleteGuid, setCategoryToDeleteGuid] = useState();
    const [categoryToEditGuid, setCategoryToEditGuid] = useState();
    const [categoryToEditName, setCategoryToEditName] = useState();
    const [categoryToEditAlarm, setCategoryToEditAlarm] = useState();
    const [categoryToAddName, setCategoryToAddName] = useState("");
    const [categoryToAddAlarm, setCategoryToAddAlarm] = useState(0);

    const [categoryClicked, setCategoryClicked] = useState({ name: "" });

    const [filterPhrase, setFilterPhrase] = useState("");

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');
    const [chooseClickedModalFadingClass, setChooseClickedModalFadingClass] = useState('fadeOut');

    const [deleteAssignedProductsFlag, setDeleteAssignedProductsFlag] = useState(false);

    const navigate = useNavigate();

    const editNameTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_category_name}:`}
            value={categoryToEditName}
            onChange={(e) => setCategoryToEditName(e.target.value)}
        ></TextBoxComponent>
    );

    const editAlarmTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_category_alarm}:`}
            type="number"
            value={categoryToEditAlarm}
            onChange={(e) => { setCategoryToEditAlarm(e.target.value) }}
            min={0}
        ></TextBoxComponent>
    );

    const deleteCategoryFormItems = [(<span><input type="checkbox" checked={deleteAssignedProductsFlag} onChange={() => setDeleteAssignedProductsFlag(!deleteAssignedProductsFlag)}></input> Usuń też przypisane produkty</span>)];

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

    function onFiltered(phrase) {
        setFilterPhrase(phrase)
    }

    function hideDeleteModal() {
        setDeleteModalFadingClass("fadeOut");
    }

    function hideEditModal() {
        setEditModalFadingClass('fadeOut');
    }

    function hideChooseModal() {
        setChooseClickedModalFadingClass('fadeOut');
    }

    function showDeleteModal(guid) {
        setCategoryToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function showEditModal(guid) {
        setCategoryToEditGuid(guid);
        setCategoryToEditName(getCategory({ guid: guid }).name);
        setCategoryToEditAlarm(getCategory({ guid: guid }).alarm);
        setEditModalFadingClass("fadeIn");
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

    function addCategory() {
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

    function filteredCategories() {
        return filterItems(props.categories, filterPhrase, ["alarm"]);
    }

    return (
        <div id="categories-tab" style={localStyle} className="CategoriesComponent">
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_category}
                text={`${captions.message_are_you_sure_to_remove_category}: ${getCategory({ guid: categoryToDeleteGuid })?.name}? Produkty z wciąż przypisaną kategorią:`}
                contentLines={props.products.filter((item) => (item.category_id == categoryToDeleteGuid)).map((item) => (item.name))}
                formLines={deleteCategoryFormItems}
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => { deleteCategory(categoryToDeleteGuid) }}
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
                title={captions.message_category_edit}
                text=""
                contentLines={[editNameTextBoxComponent, editAlarmTextBoxComponent]}
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class="modal-edit-button1"
                button2Action={() => { updateCategory(categoryToEditGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={hideEditModal}>
            </InfoModalComponent>

            <ChooseWhereToGoModalComponent
                mainWindowClassName={`modal-where-to-go ${chooseClickedModalFadingClass}`}
                button1Text={`Pokaż produkty w ${categoryClicked.name}`}
                button1Action={() => { navigate(`/products?category=${categoryClicked.guid}`); }}
                button2Text={`Pokaż zapasy w ${categoryClicked.name}`}
                button2Action={() => { navigate(`/categories/${categoryClicked.guid}`); }}
                button3Class="none"
                fadeOut={hideChooseModal}

            ></ChooseWhereToGoModalComponent>

            <AutocompleteSearchComponent
                onChange={onFiltered}
                value={filterPhrase}
                items={props.categories}
            ></AutocompleteSearchComponent>

            <div className="categories-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            <th>{captions.field_category_name}</th>
                            <th>{captions.field_category_alarm}</th>
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
                                <MdAddBox role="button" tabIndex="0" onClick={() => addCategory()}></MdAddBox>
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

export default CategoriesComponent;
