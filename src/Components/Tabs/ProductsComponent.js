import React from 'react';
import { useState, useEffect, useRef } from 'react';
import guidGenerator from 'guid-generator';

import { FaEdit, FaCamera, FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';

import InfoModalComponent from './../InfoModalComponent.js';
import TextBoxComponent from './../TextBoxComponent.js';
import AutocompleteSearchComponent, { filterItems } from './../AutocompleteSearchComponent.js';

import './../../Styles/Tabs/ProductsComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"
import DropDownComponent from './../DropDownComponent.js';
import CameraComponent from './CameraComponent.js';

function ProductsComponent(props) {
    const [productToDeleteGuid, setproductToDeleteGuid] = useState();

    const [filterPhrase, setFilterPhrase] = useState("");

    const [productToEditGuid, setProductToEditGuid] = useState();
    const [productToEditName, setProductToEditName] = useState("");
    const [productToEditBarcode, setProductToEditBarcode] = useState("");
    const [productToEditAlarm, setProductToEditAlarm] = useState(0);
    const [productToEditCategoryId, setProductToEditCategoryId] = useState();
    const [productToEditPicture, setProductToEditPicture] = useState();

    const [productToAddName, setProductToAddName] = useState("");
    const [productToAddBarcode, setProductToAddBarcode] = useState("");
    const [productToAddAlarm, setProductToAddAlarm] = useState();
    const [productToAddCategoryId, setProductToAddCategoryId] = useState();

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    const currentState = useRef();

    const nameComponent = (
        <TextBoxComponent
            label={`${captions.field_product_name}:`}
            value={productToEditName}
            onChange={(e) => { setProductToEditName(e.target.value) }}
        ></TextBoxComponent>
    );
    const categoryDropDownComponent = (
        <DropDownComponent
            handleChange={handleProductEditCategoryChange}
            label={captions.field_category_name}
            options={props.categories}
            selectedId={productToEditCategoryId}
        ></DropDownComponent>
    );
    const barcodeComponent = (
        <TextBoxComponent
            label={captions.field_barcode}
            value={productToEditBarcode}
            onChange={(e) => { setProductToEditBarcode(e.target.value) }
            }
        ></TextBoxComponent>
    );
    const alarmComponent = (
        <TextBoxComponent
            label={captions.field_alarm}
            value={productToEditAlarm}
            type="number"
            onChange={(e) => { setProductToEditAlarm(e.target.value) }}
        ></TextBoxComponent>
    );
    const cameraComponent = (
        <CameraComponent
            quagga={props.quagga}
            onPictureTaken={(data) => setProductToEditPicture(data)}>
        </CameraComponent>
    );

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    var localStyle = { display: props.activeTab === names.products_tab ? 'block' : 'none' };

    function mapToColumns(items) {
        return items.map((item) => ({
            ...item,
            categoryName: getCategory(item.category_id)?.name,
        }));
    }

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        console.log('barcode scanned on products tab', barcode);
        //if (isEditingProduct()) {
        //    setproductToEditBarcode(barcode);
        //} else if (IsAddingProduct()) {
        //    setProductToAddBarcode(barcode);
        //} else if (IsProductsTabActive()) {
        //    var guid = getproduct({ barcode: barcode })?.guid;
        //    if (guid)
        //        onProductNameClicked(guid);
        //    else {
        //        // nie ma takiego kodu w bazie schowkow. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac artykul lub schowek)
        //    }
        //}
    }

    function onProductNameClicked(guid) {   //call also when scanned

        var _products = props.products.map((item) => {
            return (item.guid == guid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setProducts(_products);

        console.log('Move to "Zapasy" with Supplies filtered by product of id:' + guid);
    }

    function onCategoryClicked(categoryGuid) {
        var _products = props.products.map((item) => {
            return (item.category_id == categoryGuid) ?
                { ...item, frequency: item.frequency + 1 } :
                item;
        });

        props.setProducts(_products);

        console.log('Move to categories with this selected/ (show only products/supplies of this category) / choose what to do');
    }

    function onBarcodeClicked(barcode) {
        // move to barcode generator with this code
    }

    function onFiltered(phrase) {
        setFilterPhrase(phrase);
    }
    function filteredProducts() {
        return filterItems(mapToColumns(props.products), filterPhrase, ["alarm", "categoryName"]);
    }

    function handleProductEditCategoryChange(e) {
        setProductToEditCategoryId(e.target.value)
    }

    function handleProductAddCategoryChange(e) {
        setProductToAddCategoryId(e.target.value);
    }

    function hideDeleteModal() {
        setDeleteModalFadingClass("fadeOut");
    }

    function hideEditModal() {
        setEditModalFadingClass('fadeOut');
    }

    function showDeleteModal(guid) {
        setproductToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function showEditModal(guid) {
        setProductToEditGuid(guid);
        setProductToEditName(getproduct({ guid: guid }).name);
        setProductToEditCategoryId(getproduct({ guid: guid }).category_id);
        setProductToEditBarcode(getproduct({ guid: guid }).barcode);
        setProductToEditAlarm(getproduct({ guid: guid }).alarm);

        setEditModalFadingClass("fadeIn");
    }

    function getproduct({ guid = null, barcode = null } = {}) {
        if (guid) {
            var product = props.products.filter((item) => item.guid == guid)[0];
            return product ? product : null;
        }
        if (barcode) {
            var product = props.products.filter((item) => item.barcode == barcode)[0];
            return product ? product : null;
        }

        return null;
    }

    function getCategory(categoryGuid) {
        return props.categories.filter((item) => (item.guid == categoryGuid))[0];
    }

    function deleteProduct(guid) {
        //TODO: display warning ! IF removed product, then what? Attach all left supplies to some 'uncategorized'? Or delete all supplies?
        alert('Todo: implement warning window here. Reattach or remove children nodes');

        var _products = props.products.filter((item) => item.guid != guid);
        props.setProducts(_products);
        //setProductsToDisplay(_products);
        setDeleteModalFadingClass("fadeOut");
    }

    function updateProduct(productId) {
        var _products = props.products.map((item) => {
            return (item.guid == productId) ? {
                name: productToEditName,
                category_id: productToEditCategoryId,
                guid: productToEditGuid,
                barcode: productToEditBarcode,
                alarm: productToEditAlarm
            } : item
        });

        props.setProducts(_products);
        setEditModalFadingClass('fadeOut');
        //   setProductsToDisplay(_products);
    }

    function addproduct() {
        var _products = props.products.slice();
        _products.push({
            guid: guidGenerator(),
            name: productToAddName,
            category_id: productToAddCategoryId ? productToAddCategoryId : props.categories[0].guid,
            barcode: productToAddBarcode,
            alarm: productToAddAlarm
        });

        props.setProducts(_products);

        setProductToAddName('');
        setProductToAddBarcode('');
        setProductToAddAlarm(0);
        //setProductsToDisplay(_products);
    }

    function IsProductsTabActive() {
        return currentState.current.props.activeTab == "products_tab";
    }
    function IsAddingProduct() {
        //sprawdzic
        return document.activeElement.id == names.add_product_barcode_input || document.activeElement.id == names.add_product_name_input;
    }
    function isEditingProduct() {
        //sprawdzic
        return currentState.current.props.activeTab == "products_tab" && currentState.current.editModalFadingClass == "fadeIn";
    }

    function openScannerToAddProductCode() {
    }
    function openCameraToAddProductPicture() {
    }

    return (
        <div id="products-tab" style={localStyle} className="ProductsComponent">
            <InfoModalComponent
                mainWindowClassName={`modal-delete-window ${deleteModalFadingClass}`}
                mainWindowTopBarClassName="modal-delete-top-bar"
                topBarXButtonClassName="modal-delete-x-button"
                ContentClassName="modal-delete-content"
                title={captions.message_removing_product}
                text={`${captions.message_are_you_sure_to_remove_product}: ${getproduct({ guid: productToDeleteGuid })?.name}?`}
                content=""
                button1Text={captions.message_no}
                button1Class="modal-delete-button1"
                button1Action={() => setDeleteModalFadingClass("fadeOut")}
                button2Text={captions.message_yes}
                button2Class="modal-delete-button1"
                button2Action={() => { deleteProduct(productToDeleteGuid) }}
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
                title={captions.message_product_edit}
                text=""
                contentLines={[cameraComponent, nameComponent, categoryDropDownComponent, barcodeComponent, alarmComponent]}
                button1Text={captions.message_cancel}
                button1Class="modal-edit-button1"
                button1Action={() => setEditModalFadingClass("fadeOut")}
                button2Text={captions.message_save}
                button2Class="modal-edit-button1"
                button2Action={() => { updateProduct(productToEditGuid) }}
                button3Text=""
                button3Class="none"
                button3Action=""
                fadeOut={hideEditModal}>
            </InfoModalComponent>
            [Wstgawic okienko ze skanerem!]
            <AutocompleteSearchComponent
                onChange={onFiltered}
                items={mapToColumns(props.products)}
            ></AutocompleteSearchComponent>
            <div className="products-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            <th>{captions.field_product_name}</th>
                            <th>{captions.field_category_name}</th>
                            <th>{captions.field_barcode}</th>
                            <th>{captions.field_alarm}</th>
                            <th>{captions.field_img}</th>
                        </tr>
                        <tr className="table-header">
                            <th>
                                <TextBoxComponent
                                    id={names.add_product_name_input}
                                    value={productToAddName}
                                    placeholder={captions.field_product_name}
                                    onChange={(e) => { setProductToAddName(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <DropDownComponent
                                    handleChange={handleProductAddCategoryChange}
                                    label=""
                                    options={props.categories}
                                ></DropDownComponent>
                            </th>
                            <th>
                                <TextBoxComponent
                                    className="inline-table"
                                    id={names.add_product_barcode_input}
                                    value={productToAddBarcode}
                                    placeholder={captions.field_barcode}
                                    onChange={(e) => { setProductToAddBarcode(e.target.value) }}
                                ></TextBoxComponent>
                                <FaCamera role="button" tabIndex="0" onClick={() => openScannerToAddProductCode()}></FaCamera>
                            </th>
                            <th>
                                <TextBoxComponent
                                    id={names.add_product_alarm_input}
                                    type="number"
                                    value={productToAddAlarm}
                                    placeholder={captions.field_product_alarm}
                                    onChange={(e) => { setProductToAddAlarm(e.target.value) }}
                                ></TextBoxComponent>
                            </th>
                            <th>
                                <FaCamera role="button" tabIndex="0" onClick={() => openCameraToAddProductPicture()}></FaCamera>
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => addproduct()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {filteredProducts(mapToColumns(props.products)).sort((a, b) => { return b.frequency - a.frequency }).map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onProductNameClicked(item.guid)}>
                                        {item.name}
                                    </a></td>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onCategoryClicked(item.category_id)}>
                                        {item.categoryName}
                                    </a>
                                </td>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onBarcodeClicked(item.barcode)}>
                                        {item.barcode}</a>
                                </td>
                                <td>{item.alarm}</td>
                                <td>img(click)</td>
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

export default ProductsComponent;
