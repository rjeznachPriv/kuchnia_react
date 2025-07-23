import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ChooseWhereToGoModalComponent from './../ChooseWhereToGoModalComponent.js';

import './../../Styles/Tabs/CategoriesComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import captions from "./../../Configuration/LocalizedCaptionsPL.json"
import MyDataTable from '../MyDataTable.js';

function CategoriesComponent(props) {
    const [categoryClicked, setCategoryClicked] = useState({ name: "" });

    const [filterPhrase, setFilterPhrase] = useState("");
    const [searchComponentTouched, setSearchComponentTouched] = useState(false);

    const [chooseClickedModalFadingClass, setChooseClickedModalFadingClass] = useState('fadeOut');

    const navigate = useNavigate();

    useEffect(() => {
        props.registerBarcodeListener(onBarcodeScannedWhenEditingScreenActive);
    }, []);

    var localStyle = { display: props.activeTab === names.categories_tab ? 'block' : 'none' };

    function onBarcodeScannedWhenEditingScreenActive(barcode) {
        console.log('scan', barcode);
        // categories nioe ma barcode. Przejdz do CHOOSE? z tym zeskanowanym guidem (dodac produkt/zasób?)
    }

    function calculateFilterPhrase() {
        return searchComponentTouched ? filterPhrase : props.filterPhrase;
    }

    return (
        <div id="categories-tab" style={localStyle} className="CategoriesComponent">

            <ChooseWhereToGoModalComponent
                mainWindowClassName={`modal-where-to-go ${chooseClickedModalFadingClass}`}
                button1Text={`Pokaż produkty w ${categoryClicked.name}`}
                button1Action={() => { navigate(`/products?category=${categoryClicked.guid}`); }}
                button2Text={`Pokaż zapasy w ${categoryClicked.name}`}
                button2Action={() => { navigate(`/categories/${categoryClicked.guid}`); }}
                button3Class="none"
                fadeOut={() => { setChooseClickedModalFadingClass('fadeOut') }}

            ></ChooseWhereToGoModalComponent>

            <MyDataTable
                columns={[
                    { name: "guid", type: "text" },
                    { name: "name", type: "text", displayName: captions.field_category_name, required: true },
                    { name: "alarm", type: "number", displayName: captions.field_category_alarm },
                    { name: "frequency", type: "number" },
                ]}
                resources={props.categories}
                setResources={props.setCategories}
                filterPhrase={calculateFilterPhrase()}
                resourceName={"categories"}

                deleteWindowTitle={captions.message_removing_category}
                deleteWindowText={captions.message_are_you_sure_to_remove_category}
            ></MyDataTable>

        </div>
    );
}

export default CategoriesComponent;
