import { useState, useEffect } from 'react';
import JsBarcode from "jsbarcode";
import { AiFillPrinter } from 'react-icons/ai';
import $ from 'jquery';
import './../Styles/BarcodeGeneratorComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import { isAlphaNumericKey, printSvg } from './../utils/utils.js';
import captions from "./../Configuration/LocalizedCaptionsPL.json";

function BarcodeGeneratorComponent(props) {

    var localStyle = { display: props.activeTab === names.barcode_generator_tab ? 'block' : 'none' }

    useEffect(() => {
        JsBarcode(`#${names.barcode}`, captions.message_example_barcode);
    }, []);

    const [code, setCode] = useState(captions.message_example_barcode);

    function handleKeyDown(e) {
        if (isAlphaNumericKey(e))
            return;
        e.preventDefault();
    }

    function handleChange(e) {
        e.preventDefault();
        setCode(e.target.value);
        if (e.target.value != '') {
            JsBarcode(`#${names.barcode}`, e.target.value);
        }
    }

    function print() {
        printSvg(`#${names.barcode}`);
    }

    return (
        <div id={names.barcode_generator_tab} className="BarcodeGeneratorComponent" style={localStyle}>
            <span className="info">{captions.message_barcode_usage_l1}
                <ul>
                    <li>{captions.message_barcode_usage_l2}</li>
                    <li>{captions.message_barcode_usage_l3}</li>
                </ul>
            </span>
            <div className="data">
                <div className="dataContent">
                    <span >Kod :</span>
                    <input className="barcodeGenerator"
                        placeholder={captions.message_example_barcode}
                        value={code}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    <span className="printer">
                        <AiFillPrinter role="button" tabIndex="0" onClick={() => print()}></AiFillPrinter>
                    </span>

                </div>
            </div>
            <div className="result">
                <svg id={ names.barcode}></svg>
            </div>
        </div>
    );
}

export default BarcodeGeneratorComponent;
