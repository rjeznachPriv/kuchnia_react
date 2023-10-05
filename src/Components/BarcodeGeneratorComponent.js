import { useState, useEffect, useRef } from 'react';
import './../Styles/BarcodeGeneratorComponent.css';
import JsBarcode from "jsbarcode";

function BarcodeGeneratorComponent(props) {

    var localStyle2 = { display: props.activeTab === 'barcode_generator_tab' ? 'block' : 'none' };

    useEffect(() => {
        JsBarcode("#barcode", "Hi world!");
    }, []);

    return (
        <div id="barcode-tab" className="BarcodeGeneratorComponent" style={localStyle2}>
            <svg id="barcode"></svg>
        </div>
    );
}

export default BarcodeGeneratorComponent;
