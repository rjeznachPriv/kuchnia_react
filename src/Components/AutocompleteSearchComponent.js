import React, { useState, useEffect } from "react";

import './../Styles/AutocompleteSearchComponent.css';

function AutocompleteSearchComponent(props) {

    const [searchInput, setSearchInput] = useState("");

    function handleChange(e) {
        e.preventDefault();
        setSearchInput(e.target.value);
        props.callback(searchList(e.target.value));
    }

    function searchList(phrase) {
        let filteredItems = props.items.filter((item) => {
            return item.name.match(phrase.toLowerCase());
        });

        return filteredItems;
    }

    return (
        <input
            Type="search"
            placeholder="Search here"
            onChange={handleChange}
            value={searchInput}
        />
  );
}

export default AutocompleteSearchComponent;
