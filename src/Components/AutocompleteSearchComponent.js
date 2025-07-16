import React from "react";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

import './../Styles/AutocompleteSearchComponent.css';

function AutocompleteSearchComponent(props) {

    function handleChange(e) {
        e.preventDefault();
        try {
            props.onChange(e.target.value);
        } catch (err) {
            console.log('Error on Autocomplete component. props.onChange not passed?', err)
        }
    }

    return (
        <div className="AutocompleteSearchComponent">
            <div className="searchBox-label">{captions.message_search} :</div>
            <input className="searchBox"
                type="search"
                placeholder={captions.message_search}
                onChange={handleChange}
                value={props.value}
            />
        </div>
    );
}

export default AutocompleteSearchComponent;

export function filterItems(list, phrase, additionalColumns) {
    var filteredItems = list.filter((item) => {

        return item.name?.toLowerCase()?.match(phrase?.toLowerCase())
            || item.barcode?.toLowerCase()?.match(phrase?.toLowerCase())
            || additionalColumns?.some((column) => {
                return item[column]?.toString().toLowerCase()?.match(phrase?.toLowerCase());
            });
    });

    return filteredItems;
}