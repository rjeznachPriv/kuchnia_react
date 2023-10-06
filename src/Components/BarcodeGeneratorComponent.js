import { useState, useEffect, useRef } from 'react';
import './../Styles/BarcodeGeneratorComponent.css';
import JsBarcode from "jsbarcode";
import { AiFillPrinter } from 'react-icons/ai';
import $ from 'jquery';

function BarcodeGeneratorComponent(props) {

    var localStyle2 = { display: props.activeTab === 'barcode_generator_tab' ? 'block' : 'none' };  //TODO
    var newWindowPointer;

    useEffect(() => {
        JsBarcode("#barcode", "Ala ma kota");
        window.addEventListener("afterprint", () => { });
        window.onafterprint = () => { newWindowPointer.close(); };
    }, []);

    const [code, setCode] = useState("Ala ma kota");

    function handleKeyDown(e) {         //move it
        if (/[0-9a-zA-Z]/i.test(e.key) || [8, 32].some((code) => e.keyCode == code))    // Allow backspace and space
            return;
        e.preventDefault();
    }

    function handleChange(e) {
        e.preventDefault();
        setCode(e.target.value);
        if (e.target.value != '') {
            JsBarcode("#barcode", e.target.value);
        }
    }

    function print() {
        printSvg('#barcode');
    }

    function printSvg(selector) {                                   // move it
        var divContents = $(selector)[0].outerHTML;                 //outerHtml for printing svg as graphics
        var newWindow = window.open('', '', 'height=500, width=500');
        newWindowPointer = newWindow;
        newWindow.document.write('<html>');
        newWindow.document.write(divContents);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.print();
    }

    return (
        <div id="barcode-tab" className="BarcodeGeneratorComponent" style={localStyle2}>
            <span className="info">Kod można wydrukować, a następnie nakleić:
                <ul>
                    <li>Na schowek, w którym  przechowujemy produkty </li>
                    <li>Na produkt, który nie ma swojego kodu </li>
                </ul>
            </span>
            <div className="data">
                <div className="dataContent">
                    <span >Kod :</span>
                    <input className="barcodeGenerator"
                        placeholder="Ala ma kota"
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
                <svg id="barcode"></svg>
            </div>
        </div>
    );
}

export default BarcodeGeneratorComponent;
