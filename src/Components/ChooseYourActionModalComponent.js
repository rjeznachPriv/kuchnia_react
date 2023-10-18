import { useState, useEffect, useRef } from 'react';
import JsBarcode from "jsbarcode";
import $ from 'jquery';
import names from "./../Configuration/VitalHTMLids.json";
import './../Styles/ChooseYourActionModalComponent.css';

function ChooseYourActionModalComponent(props) {

    var localStyle = { display: props.activeTab === names.choose_tab ? 'block' : 'none' };

    useEffect(() => {
        if (ValidateBarCode(props.barcode))
            JsBarcode("#scanned-barcode", props.barcode);
    }, [props.barcode]);

    useEffect(() => {
        //draw picture on element
        $('#taken-photo').attr('src', props.pictureData);
    }, [props.pictureData]);


    function ValidateBarCode(code) {
        return /^[a-z0-9]+$/i.test(code);

    }

    return (
        <div id={names.choose_tab} style={localStyle} className="ChooseYourActionModalComponent">
            <input value={props.barcode}></input>
            <svg id="scanned-barcode"></svg>
            <img id="taken-photo"></img>

            [Ten ekran pojawia sie gdy zeskanujemy kod bez zadnego kontekstu,lub zrobieniu zdjecia]
            [Tutaj pojazwia sie zeskanowany kod]
            1. Po zeskanowaniu schowka
            - zapytaj czy:
            a.Pokaz liste produktow w danym schowku
            b. Wyjmij produkt
            c. Doloz produkt
            d.Pokaz czego brakuje do minimalnego stanu schowka
            e. Ustal minimalny stan schowka (edycja?)
            2. Po zeskanowaniu znanego produktu
            - Jesli jestes na zakupach to dodaj produkt do koszyka (skresl z listy zakupow)
            - zapytaj czy:
            - Wybrac schowek z ktorego zabrano zeskanowany produkt
            - Wybrac schowek do ktorego Dolozono zeskanowany produkt(Wprowadz date przydatnosci)
            - Ustal ogolny minimalny stan zapasow dla zeskanowanego produktu
            3. Po zeskanowaniu nieznanego kodu
            - Jesli jestes na zakupach to dodaj produkt do koszyka
            - zapytaj czy to produkt/schowek
            -dodaj do bazy znanych produktow/schowkow

            4. Po zrobieniu zdjecia: przejdz do dodawania produktu

        </div>
    );
}

export default ChooseYourActionModalComponent;
