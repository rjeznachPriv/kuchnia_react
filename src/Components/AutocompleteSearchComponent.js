import React, { useState, useMemo} from "react";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

import './../Styles/AutocompleteSearchComponent.css';

function AutocompleteSearchComponent(props) {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredItems = useMemo(() => {
        if (!props.value) return [];
        const lower = props.value?.toString().toLowerCase();
        return props.items.filter(item => item?.toString().toLowerCase().includes(lower));
    }, [props.value, props.items]);

    function handleChange(e) {
        e.preventDefault();
        try {
            setShowSuggestions(true);
            props.onChange(e.target.value);
        } catch (err) {
            console.log('Error on Autocomplete component. props.onChange not passed?', err)
        }
    }

    const handleItemClick = (item) => {
        props.onChange(item);
        setShowSuggestions(false);
    };

    return (
        <div className="AutocompleteSearchComponent">
            <div className="searchBox-label">{captions.message_search} :</div>
            <input className="searchBox"
                type="search"
                placeholder={captions.message_search}
                onChange={handleChange}
                value={props.value}
            />
            {showSuggestions && filteredItems.length > 0 && (
                <ul className="suggestions">
                    {filteredItems.map(item => (
                        <li key={item}
                            onClick={() => handleItemClick(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteSearchComponent;

export function filterItems(list, phrase, additionalColumns) {
    var filteredItems = list.filter((item) => {

        return item.barcode?.toLowerCase()?.match(phrase?.toLowerCase())
            || additionalColumns?.some((column) => {
                return item[column]?.toString().toLowerCase()?.match(phrase.toString()?.toLowerCase());
            });
    });

    return filteredItems;
}