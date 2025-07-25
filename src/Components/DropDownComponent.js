import React, { useEffect } from 'react';

import captions from "./../Configuration/LocalizedCaptionsPL.json"
import './../Styles/DropDownComponent.css';

function DropDownComponent(props) {
    useEffect(() => {
        console.log(props);
        console.log(props.selectedId);
    }, []);

    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <select value={props.selectedId} onChange={(e) => props.handleChange(e)}>
                {props.options?.map((item) => (
                    <option value={item.guid} key={item.guid}>
                        {item.name}
                    </option>
                ))}
                <option value="" selected disabled hidden>{captions.message_choose}</option>
            </select>
        </div>
    );
}

export default DropDownComponent;

export function getSelectableFieldLabel(column, item) {
    let label = column?.dataSource?.filter((dataItem) => (dataItem.guid === item[column.name]))[0]?.name;
    return label;
}
