import { useState, useEffect } from 'react';

import { ReactBarcode } from 'react-jsbarcode';

import { AiFillPrinter } from 'react-icons/ai';
import { MdAddBox } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import './../../Styles/Tabs/BarcodeGeneratorComponent.css';
import names from "./../../Configuration/VitalHTMLids.json";
import { isAlphaNumericKey, printSvgS } from './../../utils/utils.js';
import captions from "./../../Configuration/LocalizedCaptionsPL.json";

function BarcodeGeneratorComponent(props) {

    var localStyle = { display: props.activeTab === names.barcode_generator_tab ? 'block' : 'none' }

    useEffect(() => {

    }, []);

    const [codes, setCodes] = useState([captions.message_example_barcode]);

    function handleKeyDown(e) {
        if (isAlphaNumericKey(e))
            return;
        e.preventDefault();
    }

    function handleChange(e) {
        e.preventDefault();
        let index = e.target.id.split(names.barcode_generator_textField)[1];
        let newCode = e.target.value;

        let updatedCodes = [...codes];
        updatedCodes[index] = newCode;

        setCodes(updatedCodes);
    }

    function print() {
        printSvgS(codes.map((item, index) => { return `.${names.barcode}${index}`; }));
    }

    function addCode() {
        setCodes(prev => [...prev, "kod"]);
    }

    function deleteCode(index) {
        setCodes(prev => prev.filter((_, i) => i !== index));
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

                    {codes.map((item, index) => (
                        <div className="codeInputRow" key={`${names.barcode_generator_textField}${index}`}>
                            <input className="barcodeGenerator"
                                placeholder={captions.message_example_barcode}
                                value={item}
                                id={`${names.barcode_generator_textField}${index}`}
                                onKeyDown={handleKeyDown}
                                onChange={handleChange}
                            />

                            {index === codes.length - 1 ?
                                <MdAddBox className="addCodeButton" role="button" tabIndex="0" onClick={() => addCode()}></MdAddBox> :
                                <FaTimes className="removeCodeButton" role="button" tabIndex="0" onClick={() => deleteCode(index)}></FaTimes>
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className="result">
                {codes.map((item, index) => (

                    <ReactBarcode value={item} className={`${names.barcode}${index}`} key={`${names.barcode}${index}`} />
                ))}

            </div>
            <div>
                <span className="printer">
                    <AiFillPrinter role="button" tabIndex="0" onClick={() => print()}></AiFillPrinter>
                </span>
            </div>
        </div>
    );
}

export default BarcodeGeneratorComponent;
