import React, { useState, useEffect } from "react";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

import './../Styles/AutocompleteSearchComponent.css';

function AutocompleteSearchComponent(props) {

    const [searchInput, setSearchInput] = useState("");

    function handleChange(e) {
        e.preventDefault();
        setSearchInput(e.target.value);
        props.callback(searchList(e.target.value));
    }

    function searchList(phrase) {
        var filteredItems = props.items.filter((item) => {
            return item.name.match(phrase.toLowerCase());
        });

        return filteredItems;
    }

    return (
        <div className="AutocompleteSearchComponent">
            <div className="searchBox-label">{captions.message_search} :</div>
            <input className="searchBox"
                type="search"
                placeholder={captions.message_search}
                onChange={handleChange}
                value={searchInput}
            />
        </div>
    );
}

export default AutocompleteSearchComponent;
