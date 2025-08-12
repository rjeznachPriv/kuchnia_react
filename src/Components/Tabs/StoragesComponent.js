import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ChooseWhereToGoModalComponent from './../ChooseWhereToGoModalComponent.js';

import './../../Styles/Tabs/StoragesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"
import InteractiveDataTable from './../InteractiveDataTable .js';

function StoragesComponent(props) {
    const [storageClicked, setStorageClicked] = useState({ name: "" });

    const [chooseClickedModalFadingClass, setChooseClickedModalFadingClass] = useState('fadeOut');

    const navigate = useNavigate();

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    var localStyle = { display: props.activeTab === names.storages_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        console.log('storages scan', barcode);
        // Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac produkt/zasób?)
    }

    function onStorageClicked(storage, columnName) {
        setStorageClicked(storage);
        setChooseClickedModalFadingClass('fadeIn')
        console.log('storage clicked inside dataTable');
        console.log(storage);
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
        <div id={names.storages_tab} style={localStyle} className="StoragesComponent storages-table-container" >

            <ChooseWhereToGoModalComponent
                mainWindowClassName={`modal-where-to-go ${chooseClickedModalFadingClass}`}
                button1Text={`Poka¿ produkty w ${storageClicked.name}`}
                button1Action={() => { navigate(`/products?storage=${storageClicked.guid}`); }}
                button2Text={`Poka¿ zapasy w ${storageClicked.name}`}
                button2Action={() => { navigate(`/storages/${storageClicked.guid}`); }}
                button3Class="none"
                fadeOut={() => { setChooseClickedModalFadingClass('fadeOut') }}

            ></ChooseWhereToGoModalComponent>

            <InteractiveDataTable
                quagga={props.quagga}
                onResourceClicked={onStorageClicked}
                onScannerIconClicked={openScanner}
                columns={[
                    { name: "guid", type: "text", searchable: true },
                    { name: "frequency", type: "number" },
                    {
                        name: "name",
                        type: "text",
                        displayName: captions.field_storage_name,
                        validation: { required: true, required_message: captions.message_validation_required, },
                        sortable: true,
                        searchable: true,
                    },
                    {
                        name: "barcode",
                        type: "text",
                        displayName: captions.field_barcode,
                        validation: { required: true, required_message: captions.message_validation_required, },
                        searchable: true,
                        sortable: true,
                        scannable: true,
                    },
                ]}
                resources={props.storages}
                setResources={props.setStorages}
                initialFilterPhrase={props.filterPhrase}
                resourceName={"storages"}

                dependantResources={[{ resource: "supplies", column: "storage_id", data: props.supplies, setter: props.setSupplies }]}
                dependantResourcesNames={[captions.message_supplies]}

                deleteWindowTitle={captions.message_removing_storage}
                deleteWindowText={captions.message_are_you_sure_to_remove_storage}

                editWindowTitle={captions.message_storage_edit}
            ></InteractiveDataTable>

        </div>
    );
}

export default StoragesComponent;
