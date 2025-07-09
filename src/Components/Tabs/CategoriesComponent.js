import React from 'react';
import { useState, useEffect, useRef } from 'react';
import guidGenerator from 'guid-generator';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './../InfoModalComponent.js';
import TextBoxComponent from './../TextBoxComponent.js';
import AutocompleteSearchComponent from './../AutocompleteSearchComponent.js';

import './../../Styles/Tabs/CategoriesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

function CategoriesComponent(props) {

    const [categoriesToDisplay, setCategoriesToDisplay] = useState(props.categories);

    const [categoryToDeleteGuid, setCategoryToDeleteGuid] = useState();
    const [categoryToEditGuid, setCategoryToEditGuid] = useState();
    const [categoryToEditName, setCategoryToEditName] = useState();
    const [categoryToEditAlarm, setCategoryToEditAlarm] = useState();
    const [categoryToAddName, setCategoryToAddName] = useState();
    const [categoryToAddAlarm, setCategoryToAddAlarm] = useState();

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    const currentState = useRef();

    const nameTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_category_name}:`}
            value={categoryToEditName}
            onChangeValue={(e) => { setCategoryToEditName(e.target.value) }}
        ></TextBoxComponent>
    );

    const alarmTextBoxComponent = (
        <TextBoxComponent
            label={`${captions.field_category_alarm}:`}
            type="number"
            value={categoryToEditAlarm}
            onChangeValue={(e) => { setCategoryToEditAlarm(e.target.value) }}
        ></TextBoxComponent>
    );

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    useEffect(() => {
                
        console.log('categories:');
        console.log(props.categories);


        currentState.current = {
            'categories': props.categories,
            'editModalFadingClass': editModalFadingClass,
            'props': props
        };
    }, [props.categories, editModalFadingClass, props]);

    var localStyle = { display: props.activeTab === names.categories_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        // categories nioe ma barcode. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac produkt/zasób?)
    }

    function onCategoryNameClicked(guid) {
        var _categories = props.categories.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setCategories(_categories);
        setCategoriesToDisplay(_categories);

        console.log('Move to Products/Supplies/Chose filtered by category of id:' + guid);

        //Pokaz produkty w tej kategorii? a moze zapasy? Albo choose?

        //Raczej takie okienko, gdzie wybiera user, czy chce isc do kategorii albo do zapasów
    }

    function onFiltered(items) {
        setCategoriesToDisplay(items);
    }


    function hideDeleteModal() {
        setDeleteModalFadingClass("fadeOut");
    }

    function hideEditModal() {
        setEditModalFadingClass('fadeOut');
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

    function deleteCategory(guid) {
        //TODO: display warning ! IF removed categories, then what? Attach all left to some 'uncategorized'? Or delete all children?
        alert('Todo: implement warning window here. Reattach or remove children nodes');

        var _categories = props.categories.filter((item) => item.guid != guid);
        props.setCategories(_categories);
        setCategoriesToDisplay(_categories);
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
        setCategoriesToDisplay(_categories);
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
        setCategoriesToDisplay(_categories);
    }

    return (
        //TODO: zaimplementowac uniwerstalny dataatble?
        <div id="categories-tab" style={localStyle} className="CategoriesComponent">
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_category}
                text={`${captions.message_are_you_sure_to_remove_category}: ${getCategory({ guid: categoryToDeleteGuid })?.name}?`}
                content=""
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
                contentLines={[nameTextBoxComponent, alarmTextBoxComponent]}
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
            <AutocompleteSearchComponent
                callback={onFiltered}
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
                                    onChangeValue={(e) => { setCategoryToAddName(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <TextBoxComponent
                                    id={names.add_category_alarm_input}
                                    type="number"
                                    value={categoryToAddAlarm}
                                    placeholder={captions.field_category_alarm}
                                    onChangeValue={(e) => { setCategoryToAddAlarm(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => addCategory()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {categoriesToDisplay.sort((a, b) => { return b.frequency - a.frequency }).map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <a key={item.guid}
                                        
                                        onClick={() => onCategoryNameClicked(item.guid)}>
                                        {item.name}
                                    </a></td>
                                <td>
                                    <span>{ item.alarm}</span>
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
