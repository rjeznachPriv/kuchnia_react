import { useState, useEffect, useRef } from "react";
import captions from "./../Configuration/LocalizedCaptionsPL.json"

function SmartDropDownComponent({ options, onSelect, label, className, additional, validationMessage }) {
    const [inputValue, setInputValue] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const matches = inputValue.trim() === ""
            ? options
            : options.filter(item =>
                item.name.toLowerCase().includes(inputValue.toLowerCase())
            );

        setFilteredItems(matches);
        setHighlightedIndex(-1);
        // NIE ustawiamy tutaj setIsOpen
    }, [inputValue, options]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(item) {
        setInputValue(item.name);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onSelect(item);
    }

    function handleKeyDown(e) {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < filteredItems.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : filteredItems.length - 1
            );
        }

        if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredItems[highlightedIndex]);
        }

        if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    }

    return (
        <div className={`AutocompleteSearchComponent ${className}`} ref={wrapperRef}>
            <label>{label}</label>
            <input
                className="searchBox"
                type="text"
                placeholder={options[0]?.name || captions.message_search}
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                    setFilteredItems(options);
                    setIsOpen(true);
                    setHighlightedIndex(-1);
                }}
            />
            <p className="ValidationMessage">{validationMessage}</p>
            <span>{additional}</span>
            {isOpen && (
                <ul className="suggestions">
                    {filteredItems.map((item, index) => (
                        <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className={`autocomplete-item ${index === highlightedIndex ? "highlighted" : ""}`}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SmartDropDownComponent;

export function getSmartSelectableFieldLabel(column, item) {
    let label = column?.dataSource?.filter((dataItem) => (dataItem.guid === item[column.name]))[0]?.name;
    return label;
}