import './../Styles/DropDownComponent.css';

function DropDownComponent(props) {

    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>

            <select value={props.selectedId} onChange={(e) => props.handleChange(e)}>
                {props.options.map((item) => (
                    <option value={item.guid} key={item.guid}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DropDownComponent;
