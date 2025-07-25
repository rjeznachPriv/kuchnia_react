import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ChooseWhereToGoModalComponent from './../ChooseWhereToGoModalComponent.js';

import './../../Styles/Tabs/ProductsComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"
import MyDataTable from '../MyDataTable.js';

function ProductsComponent(props) {
    const [productClicked, setProductClicked] = useState({ name: "" });

    const [chooseClickedModalFadingClass, setChooseClickedModalFadingClass] = useState('fadeOut');

    const navigate = useNavigate();

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    var localStyle = { display: props.activeTab === names.products_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        console.log('scan', barcode);
        // Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac produkt/zasób?)
    }

    function onProductClicked(product, columnName) {
        setProductClicked(product);
        setChooseClickedModalFadingClass('fadeIn')
        console.log('product clicked inside dataTable');
        console.log(product);
        console.log(columnName);

        //TODO:
        console.log('do wyboru....');
    }

    function openScanner() {
        console.log('open scanner here');
    }

    //function onBarcodeScannedWhenEditingScreenActive(barcode) {
    //    if (isEditingStorage()) {
    //        setStorageToEditBarcode(barcode);
    //    } else if (IsAddingStorage()) {
    //        setStorageToAddBarcode(barcode);
    //    } else if (IsStoragesTabActive()) {
    //        var guid = getStorage({ barcode: barcode })?.guid;
    //        if (guid)
    //            onStorageNameClicked(guid);
    //        else {
    //            // nie ma takiego kodu w bazie schowkow. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac artykul lub schowek)
    //        }
    //    }
    //}

    return (
        <div id={names.products_tab} style={localStyle} className="ProductsComponent">

            [Wstgawic okienko ze skanerem!]
            <ChooseWhereToGoModalComponent
                mainWindowClassName={`modal-where-to-go ${chooseClickedModalFadingClass}`}
                button1Text={`Poka¿ produkty w ${productClicked.name}`}
                button1Action={() => { navigate(`/products?product=${productClicked.guid}`); }}
                button2Text={`Poka¿ zapasy w ${productClicked.name}`}
                button2Action={() => { navigate(`/products/${productClicked.guid}`); }}
                button3Class="none"
                fadeOut={() => { setChooseClickedModalFadingClass('fadeOut') }}

            ></ChooseWhereToGoModalComponent>

            <MyDataTable
                onResourceClicked={onProductClicked}
                onScannerIconClicked={openScanner}
                columns={[
                    { name: "guid", type: "text", searchable: true },
                    { name: "frequency", type: "number" },
                    {
                        name: "name",
                        type: "text",
                        displayName: captions.field_product_name,
                        validation: { required: true, required_message: captions.message_validation_required, },
                        searchable: true,
                    },
                    {
                        name: "category_id",
                        type: "select",
                        displayName: captions.field_category_name,
                        searchable: true,
                        dataSource: props.categories,
                    },
                    {
                        name: "barcode",
                        type: "text",
                        displayName: captions.field_barcode,
                        validation: { required: true, required_message: captions.message_validation_required, },
                        searchable: true,
                        scannable: true,
                    },
                    {
                        name: "alarm",
                        type: "number",
                        displayName: captions.field_category_alarm,
                        min: 0,
                        searchable: true,
                        validation: { min: 0, min_message: "TODO min is 0", }
                    },
                    {
                        name: "img",
                        type: "img",
                        displayName: captions.field_img,
                    }
                ]}
                resources={props.products}
                setResources={props.setProducts}
                initialFilterPhrase={props.filterPhrase}
                resourceName={"products"}

                dependantResources={[{ resource: "supplies", column: "product_id", data: props.supplies, setter: props.setSupplies }]}
                dependantResourcesNames={[captions.message_supplies]}

                deleteWindowTitle={captions.message_removing_product}
                deleteWindowText={captions.message_are_you_sure_to_remove_product}

                editWindowTitle={captions.message_product_edit}
            ></MyDataTable>

        </div>
    );
}

export default ProductsComponent;
