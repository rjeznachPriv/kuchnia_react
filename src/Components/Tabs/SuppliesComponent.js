import { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pl from 'date-fns/locale/pl';
import guidGenerator from 'guid-generator';

import './../../Styles/Tabs/SuppliesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"

import AutocompleteSearchComponent from './../AutocompleteSearchComponent.js';

import { FaEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';
import { FaAppleAlt } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';

function SuppliesComponent(props) {
    const bittenApple = <BsApple title={captions.explanation_product_is_open}></BsApple>;
    const apple = <FaAppleAlt title={captions.explanation_product_is_sealed}></FaAppleAlt>;

    registerLocale('pl', pl)

    const [suppliesToDisplay, setSuppliesToDisplay] = useState(props.supplies);

    const [supplyToAddName, setSupplyToAddName] = useState();
    const [supplyToAddBarcode, setSupplyToAddBarcode] = useState();
    const [supplyToAddDate, setSupplyToAddDate] = useState(new Date());
    const [supplyToAddStorage, setSupplyToAddStorage] = useState();
    const [supplyToAddIsOpen, setSupplyToAddIsOpen] = useState();

    const [supplyToEditGuid, setSupplyToEditGuid] = useState();
    const [supplyToEditName, setSupplyToEditName] = useState();
    const [supplyToEditBarcode, setSupplyToEditBarcode] = useState();
    const [supplyToEditDate, setSupplyToEditDate] = useState();
    const [supplyToEditStorage, setSupplyToEditStorage] = useState();
    const [supplyToEditIsOpen, setSupplyToEditIsOpen] = useState();

    const [supplyToDeleteGuid, setSupplyToDeleteGuid] = useState();

    var localStyle = { display: props.activeTab === names.supplies_tab ? 'block' : 'none' };

    const [deleteModalFadingClass, setDeleteModalFadingClass] = useState('fadeOut');
    const [editModalFadingClass, setEditModalFadingClass] = useState('fadeOut');

    useEffect(() => {
        setSuppliesToDisplay(mapToColumns(props.supplies));
    }, []);

    function addSupply() {
        var _supplies = props.supplies.slice();
        _supplies.push({
            guid: guidGenerator(),
            name: supplyToAddName,
            barcode: supplyToAddBarcode,
            storage: supplyToAddStorage,
            isOpen: supplyToAddIsOpen
        });

        props.setSupplies(_supplies);

        setSupplyToAddName('');
        setSupplyToAddBarcode('');
        setSupplyToAddStorage('');
        setSupplyToAddIsOpen(undefined);

        setSuppliesToDisplay(_supplies);
    }

    function showDeleteModal(guid) {
        setSupplyToDeleteGuid(guid);
        setDeleteModalFadingClass("fadeIn");
    }

    function showEditModal(guid) {
        setSupplyToEditGuid(guid);
        setSupplyToEditName("TODO");
        setSupplyToEditBarcode("TODO");
        setSupplyToEditDate("TODO");
        setSupplyToEditStorage("TODO");
        setSupplyToEditIsOpen(true); //TODO
        setEditModalFadingClass("fadeIn");
    }

    function getProduct(productGuid) {
        return props.products.filter((prod) => (prod.guid == productGuid))[0];
    }

    function getStorage(storageGuid) {
        return props.storages.filter((storage) => (storage.guid == storageGuid))[0];
    }

    function mapToColumns(items) {
        return items.map((item) => ({
            ...item,
            productName: getProduct(item.product_id).name,
            productBarcode: getProduct(item.product_id).barcode,
            storageName: getStorage(item.storage_id).name
        }));
    }

    function onFiltered(items) {
        setSuppliesToDisplay(items);
    }

    function onBarcodeClicked(barcode) {
        // move to barcode generator ?
    }

    function onSupplyNameClicked(supplyGuid) {
        // frequency++
        // move to this product/ all supplies of this product?
    }

    function onStorageNameClicked(supplyGuid) {
        // move to this storage/ show all supplies in this storage?
    }

    return (
        <div id={names.supplies_tab} className="SuppliesComponent" style={localStyle}>
            MODAL
            MODAL

            [Dodac barcode window (male okienko z aparatu)]

            <button>Poniżej limitu</button>
            <button>Blisko daty końca terminu (i otwarte)</button>
            <button>Scal te same produkty</button>

            <AutocompleteSearchComponent
                callback={onFiltered}
                items={mapToColumns(props.supplies)}
                filterColumns={["productName", "productBarcode", "product_id", "storageName", "storage_id"]}
            ></AutocompleteSearchComponent>
            <div className="supplies-table-container">
                <table>
                    <thead>
                        <tr className="table-header">
                            <th>Produkt</th>
                            <th>Kod</th>
                            <th>Data</th>
                            <th>Schowek</th>
                            <th>Otwarty?</th>
                        </tr>
                        <tr className="table-header">
                            <th>
                                smartDrop/skan
                            </th>
                            <th>
                                skan
                            </th>
                            <th>
                                <DatePicker
                                    selected={supplyToAddDate}
                                    onChange={(date) => setSupplyToAddDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    locale="pl"
                                    showYearDropdown
                                />
                            </th>
                            <th>
                                SmartDrop/skan
                            </th>
                            <th>
                                Checkbox
                            </th>
                            <th></th>
                            <th>
                                <MdAddBox role="button" tabIndex="0" onClick={() => addSupply()}></MdAddBox>
                            </th></tr>
                    </thead>
                    <tbody>
                        {suppliesToDisplay.sort((a, b) => { return b.frequency - a.frequency }).map((item) => (
                            <tr className="item" key={item.guid}>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onSupplyNameClicked(item.guid)}>
                                        {item.productName}
                                    </a>
                                </td>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onBarcodeClicked(item.barcode)}>
                                        {item.productBarcode}
                                    </a>
                                </td>
                                <td>
                                    {item.valid_until}
                                </td>
                                <td>
                                    <a key={item.guid}
                                        onClick={() => onStorageNameClicked(item.guid)}>
                                        {item.storageName}
                                    </a>
                                </td>
                                <td>
                                    {item.isOpen ? bittenApple : apple}
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

export default SuppliesComponent;
